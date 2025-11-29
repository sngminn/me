import { execSync } from 'node:child_process';
import dotenv from 'dotenv';

// .env.local 로드
dotenv.config({ path: '.env.local' });

// 설정
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash-lite';

if (!GEMINI_API_KEY) {
  console.error('❌ 오류: GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
  console.error('👉 쉘 설정이나 .env 파일에 키를 설정해주세요.');
  process.exit(1);
}

async function generateCommitMessage(diff) {
  if (!diff || diff.trim().length === 0) {
    return 'chore: 사소한 변경사항';
  }

  const prompt = `
    당신은 숙련된 개발자입니다. 제공된 git diff를 바탕으로 Conventional Commits 규약(type: subject)을 따르는 간결하고 명확한 커밋 메시지를 생성하세요.
    
    규칙:
    1. 다음 타입들을 사용하세요: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert.
    2. 제목 줄은 70자 이내로 유지하세요.
    3. **제목은 반드시 한국어로 작성하세요.**
    4. 변경 사항이 많다면, 한국어로 된 짧은 개조식 본문 설명을 제공하세요.
    5. 오직 커밋 메시지만 출력하세요. 마크다운이나 따옴표 없이.
    
    Diff:
    ${diff.substring(0, 10000)} 
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return message || 'chore: 코드 업데이트';
  } catch (error) {
    console.error('⚠️ AI 커밋 메시지 생성 실패:', error.message);
    return 'chore: 코드 업데이트';
  }
}

async function main() {
  try {
    // 1. 변경사항 스테이징
    console.log('📦 변경사항 스테이징 중...');
    execSync('git add .', { stdio: 'inherit' });

    // 2. Diff 가져오기
    const diff = execSync('git diff --staged').toString();
    if (!diff.trim()) {
      console.log('🤔 커밋할 변경사항이 없습니다.');
      return;
    }

    // 3. 메시지 생성
    console.log('🤖 커밋 메시지 생성 중...');
    const commitMsg = await generateCommitMessage(diff);
    console.log(`📝 생성된 메시지: "${commitMsg}"`);

    // 4. 커밋
    // 쌍따옴표 이스케이프 처리
    const safeCommitMsg = commitMsg.replace(/"/g, '\\"');
    execSync(`git commit -m "${safeCommitMsg}"`, { stdio: 'inherit' });

    console.log('✅ 커밋 완료! (푸시는 직접 해주세요: git push)');
  } catch (error) {
    console.error('❌ 오류:', error.message);
    process.exit(1);
  }
}

main();
