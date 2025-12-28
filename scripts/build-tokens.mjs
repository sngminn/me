import { execSync } from 'node:child_process';
// TODO: [AI Suggestion] The import for `child_process` and `fs` can be changed to use Node.js built-in module specifiers for better clarity and maintainability.
import fs from 'node:fs';
import StyleDictionary from 'style-dictionary';

// 1. Transform Tokens (Light & Dark)
console.log('🎨 Transforming tokens...');

// Light Mode
execSync('npx token-transformer tokens.json tokens-light.json primitives,color/light primitives', {
  stdio: 'inherit',
});

// Dark Mode
execSync('npx token-transformer tokens.json tokens-dark.json primitives,color/dark primitives', {
  stdio: 'inherit',
});

// 2. Build CSS
console.log('\n Building CSS...');

const sd = new StyleDictionary({
  source: ['tokens-light.json'], // 기본은 라이트
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'app/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root',
          },
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();

// 3. Append Dark Mode
console.log('🌙 Appending Dark Mode...');

const sdDark = new StyleDictionary({
  source: ['tokens-dark.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'app/',
      files: [
        {
          destination: 'tokens-dark.tmp', // 임시 파일
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: '.dark', // 다크 모드 셀렉터
          },
        },
      ],
    },
  },
});

await sdDark.buildAllPlatforms();

// 4. Merge Files
const lightCss = fs.readFileSync('app/tokens.css', 'utf8');
const darkCss = fs.readFileSync('app/tokens-dark.tmp', 'utf8');

// TODO: [AI Suggestion] The concatenation of `lightCss` and `darkCss` can be made more readable using template literals.
fs.writeFileSync('app/tokens.css', `${lightCss}\n${darkCss}`);
fs.unlinkSync('app/tokens-dark.tmp'); // 임시 파일 삭제
fs.unlinkSync('tokens-light.json'); // 중간 파일 삭제
fs.unlinkSync('tokens-dark.json'); // 중간 파일 삭제
if (fs.existsSync('tokens-cleaned.json')) {
  fs.unlinkSync('tokens-cleaned.json'); // 예전 파일 삭제 (혹시 있으면)
}

console.log('✅ Tokens built successfully!');
