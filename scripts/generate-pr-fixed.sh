#!/bin/bash

# Arguments: [Target Branch (default: develop)]
TARGET_BRANCH=${1:-develop}
CURRENT_BRANCH=$(git branch --show-current)

# Check for gh CLI
if ! command -v gh &> /dev/null; then
    echo "❌ Error: 'gh' CLI is not installed."
    echo "👉 Please install it: brew install gh"
    exit 1
fi

# Load .env from script directory if exists
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
if [ -f "$SCRIPT_DIR/.env" ]; then
  export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)
fi

if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ Error: GEMINI_API_KEY not found."
  echo "👉 Please set it in ~/my-secret-tools/.env or your shell environment."
  exit 1
fi

# --- FIX 1: Ensure changes are pushed ---
echo "🔍 Checking remote branch status..."
REMOTE_EXISTS=$(git ls-remote --heads origin $CURRENT_BRANCH)

if [ -z "$REMOTE_EXISTS" ]; then
    echo "🚀 Remote branch does not exist. Pushing..."
    git push -u origin $CURRENT_BRANCH
else
    UNPUSHED=$(git log origin/$CURRENT_BRANCH..$CURRENT_BRANCH --oneline)
    if [ -n "$UNPUSHED" ]; then
        echo "🚀 Unpushed commits found. Pushing..."
        git push
    else
        echo "✅ Branch is up to date."
    fi
fi
# ----------------------------------------

echo "🔍 Analyzing changes between $TARGET_BRANCH and $CURRENT_BRANCH..."

# 1. Find Merge Base
git fetch origin $TARGET_BRANCH > /dev/null 2>&1
git fetch origin $CURRENT_BRANCH > /dev/null 2>&1

MERGE_BASE=$(git merge-base origin/$TARGET_BRANCH origin/$CURRENT_BRANCH 2>/dev/null)

if [ -z "$MERGE_BASE" ]; then
  MERGE_BASE=$(git merge-base $TARGET_BRANCH $CURRENT_BRANCH 2>/dev/null)
fi

if [ -z "$MERGE_BASE" ]; then
  echo "⚠️ Could not find merge base. Using simple diff."
  DIFF_CONTENT=$(git diff $TARGET_BRANCH..$CURRENT_BRANCH)
  COMMITS=$(git log $TARGET_BRANCH..$CURRENT_BRANCH --oneline)
  DIFF_STATS=$(git diff --stat $TARGET_BRANCH..$CURRENT_BRANCH)
else
  echo "✅ Merge base found: $MERGE_BASE"
  DIFF_CONTENT=$(git diff $MERGE_BASE..$CURRENT_BRANCH)
  COMMITS=$(git log $MERGE_BASE..$CURRENT_BRANCH --oneline)
  DIFF_STATS=$(git diff --stat $MERGE_BASE..$CURRENT_BRANCH)
fi

# 2. Construct Prompt
PROMPT="
You are an experienced developer. Analyze the following code changes and write a Pull Request title and description.

**Format:**
TITLE: [Type]: [Concise Title in Korean]
---
## 📝 Summary
[One line summary in Korean]

## 🛠️ Changes
- [Change 1 in Korean]
- [Change 2 in Korean]

## 💡 Notes (Optional)
- [Any impact or warnings in Korean]

**Rules:**
- Write in Korean.
- Be concise.
- STRICTLY follow the format. The first line MUST start with 'TITLE:'. The third line MUST be '---'.

**Context:**
Commits:
$COMMITS

Stats:
$DIFF_STATS

Diff:
${DIFF_CONTENT:0:15000}
"

export PROMPT

# 3. Call Gemini
echo "🤖 Asking Gemini..."

API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"

RESPONSE=$(node -e "
  const https = require('https');
  const prompt = process.env.PROMPT;
  
  const data = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  });

  const url = new URL('$API_URL');
  url.searchParams.set('key', process.env.GEMINI_API_KEY);

  const req = https.request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(body);
        console.log(json.candidates?.[0]?.content?.parts?.[0]?.text || '');
      } catch (e) { console.error(e); }
    });
  });
  
  req.write(data);
  req.end();
")

if [ -z "$RESPONSE" ]; then
  echo "❌ Failed to get response from Gemini."
  exit 1
fi

# 4. Parse Response
GENERATED_TITLE=$(echo "$RESPONSE" | grep "^TITLE:" | sed 's/^TITLE: //')
GENERATED_BODY=$(echo "$RESPONSE" | sed '1,/^---$/d')

# 5. Interactive Review

# Function to edit text in vim
edit_text() {
    local content="$1"
    local tmp_file
    tmp_file=$(mktemp) || { echo "❌ Failed to create temp file"; return 1; }
    echo "$content" > "$tmp_file"
    
    # --- FIX 2: Explicit TTY redirection for vim ---
    # Redirect both stdin and stdout to /dev/tty to ensure vim works even inside scripts/pipes
    ${EDITOR:-vim} "$tmp_file" < /dev/tty > /dev/tty
    # -----------------------------------------------
    
    cat "$tmp_file"
    rm "$tmp_file"
}

echo ""
echo "=================================================="
echo "👀 Review Title:"
echo "--------------------------------------------------"
echo "$GENERATED_TITLE"
echo "--------------------------------------------------"
echo ""

while true; do
    read -p "Is this title okay? [y]es / [n]o (edit) / [q]uit: " choice < /dev/tty
    case "$choice" in 
        y|Y ) FINAL_TITLE="$GENERATED_TITLE"; break ;;
        n|N ) 
            echo "Opening editor..."
            FINAL_TITLE=$(edit_text "$GENERATED_TITLE")
            echo "New Title: $FINAL_TITLE"
            GENERATED_TITLE="$FINAL_TITLE" # Loop again to confirm
            ;;
        q|Q ) echo "Aborted."; exit 0 ;;
        * ) echo "Please answer y, n, or q." ;;
    esac
done

echo ""
echo "=================================================="
echo "👀 Review Body:"
echo "--------------------------------------------------"
echo "$GENERATED_BODY"
echo "--------------------------------------------------"
echo ""

while true; do
    read -p "Is this body okay? [y]es / [n]o (edit) / [q]uit: " choice < /dev/tty
    case "$choice" in 
        y|Y ) FINAL_BODY="$GENERATED_BODY"; break ;;
        n|N ) 
            echo "Opening editor..."
            FINAL_BODY=$(edit_text "$GENERATED_BODY")
            echo "New Body saved."
            GENERATED_BODY="$FINAL_BODY" # Loop again to confirm
            ;;
        q|Q ) echo "Aborted."; exit 0 ;;
        * ) echo "Please answer y, n, or q." ;;
    esac
done

# 6. Create PR
echo ""
echo "🚀 Creating Pull Request..."
echo "   Base: $TARGET_BRANCH"
echo "   Head: $CURRENT_BRANCH"
echo "   Title: $FINAL_TITLE"
echo ""

gh pr create \
    --base "$TARGET_BRANCH" \
    --head "$CURRENT_BRANCH" \
    --title "$FINAL_TITLE" \
    --body "$FINAL_BODY"

if [ $? -eq 0 ]; then
    echo "✅ PR Created Successfully!"
else
    echo "❌ Failed to create PR."
fi
