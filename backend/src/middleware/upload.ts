import multer from "multer";
import path from "node:path";
import type { Request, Response, NextFunction } from "express";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
]);

const upload = multer({

  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },

  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const validMimeType = allowedMimeTypes.has(file.mimetype);
    const validExtension = allowedExtensions.has(extension);

    if (!validMimeType || !validExtension) {
      return cb(
        new Error("Only JPG, JPEG, PNG, and WebP images are allowed.")
      );
    }

    cb(null, true);
  },
});

export function uploadImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          error: "Image must be 5 MB or smaller.",
        });
      }

      return res.status(400).json({
        error: "Invalid image upload.",
      });
    }

    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }

    next();
  });
}
