#!/bin/bash

# 인자값
TARGET_BRANCH=$1
SOURCE_BRANCH=$2

# 1. 병합 기준점(Merge Base) 찾기
echo "🔍 origin/$TARGET_BRANCH 와 origin/$SOURCE_BRANCH 사이의 병합 기준점 찾는 중..."
MERGE_BASE=$(git merge-base origin/$TARGET_BRANCH origin/$SOURCE_BRANCH)

if [ -z "$MERGE_BASE" ]; then
  echo "⚠️ 병합 기준점을 찾을 수 없습니다. 기본 diff를 사용합니다."
  DIFF_CONTENT=$(git diff origin/$TARGET_BRANCH..origin/$SOURCE_BRANCH)
  COMMITS=$(git log origin/$TARGET_BRANCH..origin/$SOURCE_BRANCH --oneline)
  DIFF_STATS=$(git diff --stat origin/$TARGET_BRANCH..origin/$SOURCE_BRANCH)
else
  echo "✅ 병합 기준점 발견: $MERGE_BASE"
  DIFF_CONTENT=$(git diff $MERGE_BASE..origin/$SOURCE_BRANCH)
  COMMITS=$(git log $MERGE_BASE..origin/$SOURCE_BRANCH --oneline)
  DIFF_STATS=$(git diff --stat $MERGE_BASE..origin/$SOURCE_BRANCH)
fi

# 2. 프롬프트 구성
PROMPT="
당신은 숙련된 개발자입니다. 다음 코드 변경 사항을 분석하여 Pull Request 제목과 설명을 작성하세요.

**중요: 반드시 다음 형식을 정확히 따라야 합니다:**
TITLE: [50자 이내의 간결한 제목 (한국어)]
---
[마크다운 형식의 상세 설명 (한국어)]

**작성 규칙:**
- **모든 내용은 한국어로 작성하세요.**
- 이모지를 적절히 활용하세요 (📝 요약, ✨ 변경사항, 🐛 버그 수정 등).
- 핵심 변경 사항을 요약하세요.
- 가능하다면 왜 이러한 변경이 있었는지 설명하세요.

**Context:**
Commits:
$COMMITS

Stats:
$DIFF_STATS

Diff:
${DIFF_CONTENT:0:15000}
"

# 3. Gemini 호출
echo "🤖 Gemini에게 물어보는 중..."

# 2025년 최신 모델 사용
API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=$GEMINI_API_KEY"

# Node.js를 사용하여 API 호출 (의존성 최소화)
export PROMPT
RESPONSE=$(node -e "
  const https = require('https');
  const prompt = process.env.PROMPT;
  
  const data = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  });

  const req = https.request('$API_URL', {
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
  echo "❌ Gemini로부터 응답을 받지 못했습니다."
  exit 1
fi

# 4. 응답 파싱
PR_TITLE=$(echo "$RESPONSE" | grep "^TITLE:" | sed 's/^TITLE: //')
PR_BODY=$(echo "$RESPONSE" | sed '1,/^---$/d')

# 5. GitHub Actions 출력 설정
echo "title=$PR_TITLE" >> "$GITHUB_OUTPUT"
echo "body<<EOF" >> "$GITHUB_OUTPUT"
echo "$PR_BODY" >> "$GITHUB_OUTPUT"
echo "EOF" >> "$GITHUB_OUTPUT"

echo "✅ PR 내용 생성 완료!"
