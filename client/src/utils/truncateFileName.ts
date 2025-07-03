export const truncateFileName = (
  fileName: string,
  maxLength: number,
): string => {
  const extension = fileName.split(".").pop();
  const nameWithoutExtension = fileName.slice(0, fileName.lastIndexOf("."));
  if (nameWithoutExtension.length <= maxLength) {
    return fileName;
  }
  return `${nameWithoutExtension.slice(0, maxLength)}...${extension}`;
};
