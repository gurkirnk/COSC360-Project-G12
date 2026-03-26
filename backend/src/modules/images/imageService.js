import { findImageById, createImageEntry } from "./imageRepository.js";

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

function normalizeImagePayload({ imageBase64, contentType, fileName }) {
  const trimmedImage = typeof imageBase64 === "string" ? imageBase64.trim() : "";
  const trimmedType = typeof contentType === "string" ? contentType.trim() : "";
  const trimmedName = typeof fileName === "string" ? fileName.trim() : "";

  if (!trimmedImage) {
    throw Object.assign(new Error("imageBase64 is required."), { statusCode: 400 });
  }

  const dataUrlMatch = trimmedImage.match(/^data:(.+);base64,(.+)$/);
  const resolvedContentType = trimmedType || dataUrlMatch?.[1] || "";
  const normalizedBase64 = dataUrlMatch?.[2] || trimmedImage;

  if (!resolvedContentType) {
    throw Object.assign(new Error("contentType is required."), { statusCode: 400 });
  }

  return {
    imageBase64: normalizedBase64,
    contentType: resolvedContentType,
    fileName: trimmedName || null,
  };
}

export async function saveImageAndReturnUrl(imagePayload) {
  const normalizedImage = normalizeImagePayload(imagePayload);
  const imageEntry = await createImageEntry(normalizedImage);

  return `${BACKEND_BASE_URL}/api/images/${imageEntry.id}`;
}

export async function getImageContentById(id) {
  const imageEntry = await findImageById(id);

  if (!imageEntry) {
    throw Object.assign(new Error("Image not found."), { statusCode: 404 });
  }

  return {
    contentType: imageEntry.contentType,
    fileName: imageEntry.fileName ?? null,
    buffer: Buffer.from(imageEntry.imageBase64, "base64"),
  };
}
