export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Could not read file as a base64 string"));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

export async function createImageUploadPayload(file) {
  const isFile = file instanceof File;

  if (!isFile || file.size === 0) {
    return null;
  }

  return {
    imageBase64: await fileToBase64(file),
    contentType: file.type,
    fileName: file.name,
  };
}
