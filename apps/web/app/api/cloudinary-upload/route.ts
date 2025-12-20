import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { handleResponse, handleApiError, requireAuth } from "@repo/shared-utils/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return handleApiError(
        new Error("Cloudinary credentials not configured"),
        "Server configuration error"
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return handleApiError(new Error("No file provided"), "No file provided");
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return handleApiError(
        new Error("Invalid file type"),
        "Only JPEG, PNG, WebP images and PDF files are allowed"
      );
    }

    if (file.size > MAX_SIZE) {
      return handleApiError(new Error("File too large"), "Maximum file size is 5MB");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64File, {
      folder: "nitrutsav-2026",
      resource_type: "auto",
    });

    return handleResponse({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    });
  } catch (error) {
    return handleApiError(error, "Upload failed");
  }
}
