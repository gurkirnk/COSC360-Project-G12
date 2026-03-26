export function normalizePicture(image) {
  if (!image) {
    return null;
  }

  const imageBase64 = typeof image.imageBase64 === "string"
    ? image.imageBase64.trim()
    : "";
  const contentType = typeof image.contentType === "string"
    ? image.contentType.trim()
    : "";
  const fileName = typeof image.fileName === "string"
    ? image.fileName.trim()
    : "";

  if (!imageBase64) {
    throw Object.assign(new Error("Image base64 data is missing."), { statusCode: 400 });
  }

  if (!contentType) {
    throw Object.assign(new Error("Image content type is missing."), { statusCode: 400 });
  }

  return {
    imageBase64,
    contentType,
    fileName: fileName || null,
  };
}