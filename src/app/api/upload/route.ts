import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const documentType: string | null = data.get('documentType') as string;

    if (!file) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy tệp.' }, { status: 400 });
    }
    
    if (!documentType) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy loại tài liệu.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define the upload directory
    const uploadDir = path.join(process.cwd(), 'upload');

    // Create the upload directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Define the prefix based on document type
    const prefix = documentType === 'jobDescription' ? 'mtcv' : 'hosouv';
    
    // Sanitize filename to prevent directory traversal
    const sanitizedFileName = path.basename(file.name);
    const newFileName = `${prefix}_${sanitizedFileName}`;
    const filePath = path.join(uploadDir, newFileName);

    await writeFile(filePath, buffer);

    console.log(`Đã lưu tệp vào: ${filePath}`);

    return NextResponse.json({ success: true, path: `/upload/${newFileName}` });
  } catch (error) {
    console.error('Lỗi tải lên:', error);
    return NextResponse.json({ success: false, message: 'Đã xảy ra lỗi khi tải tệp lên.' }, { status: 500 });
  }
}
