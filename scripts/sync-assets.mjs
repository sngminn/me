import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// .env.local 파일 명시적 로드
dotenv.config({ path: '.env.local' });
dotenv.config(); // 기본 .env도 로드 (fallback)

const SOURCE_DIR = process.env.OBSIDIAN_VAULT_PATH;
const TARGET_DIR = path.join(process.cwd(), 'content/posts');

function syncAssets() {
  console.log('🔄 Obsidian Assets Sync Started...');

  // 환경 변수 확인
  if (!SOURCE_DIR) {
    console.warn('⚠️  Skipping sync: OBSIDIAN_VAULT_PATH not set in .env.local');
    console.warn(
      "   (Production build usually doesn't need raw vault access if files are committed)"
    );
    return;
  }

  // 소스가 존재하는지 확인
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  // 타겟 폴더 처리 (Symlink면 삭제하고, 없으면 생성)
  if (fs.existsSync(TARGET_DIR)) {
    const stats = fs.lstatSync(TARGET_DIR);
    if (stats.isSymbolicLink()) {
      console.log('🔗 Removing existing Symlink...');
      fs.unlinkSync(TARGET_DIR);
    }
  }

  if (!fs.existsSync(TARGET_DIR)) {
    console.log('📁 Creating target directory...');
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  console.log(`📦 Copying from ${SOURCE_DIR} to ${TARGET_DIR}...`);

  try {
    fs.cpSync(SOURCE_DIR, TARGET_DIR, { recursive: true, force: true });

    console.log(`✅ Sync Complete! All files and folders copied.`);
  } catch (error) {
    console.error('❌ Sync Failed:', error);
    process.exit(1);
  }
}

syncAssets();
