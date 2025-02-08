export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File) {
  if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
    throw new Error('Type de fichier non autorisé. Utilisez PDF, Word ou PowerPoint.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Le fichier est trop volumineux. Maximum 10MB.');
  }
  return true;
}
