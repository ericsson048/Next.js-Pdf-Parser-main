import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { validateFile  } from './utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log("No file uploaded.");
      return NextResponse.json(
        { error: 'Aucun fichier n\'a été fourni' },
        { status: 400 }
      );
    }

    // Valider le fichier
    try {
      validateFile(file);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Fichier invalide' },
        { status: 400 }
      );
    }

    console.log("File data:", file);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'upload');
    await mkdir(uploadsDir, { recursive: true });
    console.log("Upload directory created:", uploadsDir);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const newFilename = `${uniqueSuffix}-${sanitizedFilename}`;
    const newFilePath = path.join(uploadsDir, newFilename);

    await writeFile(newFilePath, buffer);

    // Generate the correct URL path for the file
    const fileUrl = `/upload/${newFilename}`;
    console.log(fileUrl);
    

    return NextResponse.json({
      message: 'Fichier uploadé avec succès',
      data: {
        filePath: fileUrl,  // Use the correct URL path
        fileName: file.name,
        type: file.type,
        size: file.size,
        name: newFilename
      },
    });
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}