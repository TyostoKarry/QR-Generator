export const validateFileName = (fileName: string): boolean => {
  const allowedPattern = /^[a-zA-Z0-9._-]+$/;
  const isValid = allowedPattern.test(fileName);
  const maxLength = 100;

  if (!isValid || fileName.length === 0 || fileName.length > maxLength) {
    return false;
  }
  return true;
};
