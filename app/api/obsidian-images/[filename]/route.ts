import fs from 'fs';
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(_request: NextRequest, props: { params: Promise<{ filename: string }> }) {
  const params = await props.params;
  const { filename } = params;

  // 1. 보안 검사: 상위 디렉토리 접근 방지
  // 경로 이동 문자(..)나 슬래시가 포함되어 있으면 거부하거나 파일명만 추출
  const safeFilename = path.basename(filename);

  // 2. 파일 경로 설정
  // content/posts/files 디렉토리에서 파일을 찾습니다.
  const filePath = path.join(process.cwd(), 'content/files', safeFilename);

  // 3. 파일 존재 여부 확인
  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  // 4. MIME 타입 설정 (기본적인 이미지 포맷 지원)
  const ext = path.extname(filePath).toLowerCase();
  let contentType = 'application/octet-stream';

  switch (ext) {
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    case '.webp':
      contentType = 'image/webp';
      break;
  }

  // 5. 파일 읽기 및 응답 반환
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error reading file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
