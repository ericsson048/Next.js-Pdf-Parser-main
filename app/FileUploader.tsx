'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

export function FileUploader() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      alert('File uploaded successfully');
      setUploadProgress(100);
      router.refresh();
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(error instanceof Error ? error.message : 'Error uploading file');
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return (
    <div className="uploader-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${isUploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="upload-content">
          <svg 
            className="upload-icon" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="upload-text">
            {isDragActive
              ? 'Drop the PDF here'
              : 'Drag & drop a PDF file here, or click to select'}
          </p>
        </div>
      </div>
      {isUploading && (
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
      <style jsx>{`
        .uploader-container {
          width: 100%;
          max-width: 500px;
          margin: 20px auto;
          padding: 20px;
        }

        .dropzone {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dropzone:hover {
          border-color: #666;
        }

        .dropzone.active {
          border-color: #2196f3;
          background-color: #e3f2fd;
        }

        .dropzone.uploading {
          pointer-events: none;
          opacity: 0.7;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .upload-icon {
          color: #666;
          margin-bottom: 10px;
        }

        .upload-text {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .progress-bar-container {
          margin-top: 20px;
          width: 100%;
          height: 6px;
          background-color: #eee;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background-color: #2196f3;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
}