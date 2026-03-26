import { getImageContentById } from "./imageService.js";

export async function getImageByIdController(req, res) {
  try {
    const image = await getImageContentById(req.params.id);

    if (image.fileName) {
      res.setHeader("Content-Disposition", `inline; filename="${image.fileName}"`);
    }

    return res.type(image.contentType).send(image.buffer);
  } catch (error) {
    console.error("getImageByIdController error:", error);
    return res.status(error.statusCode ?? 500).json({ message: error.message });
  }
}
