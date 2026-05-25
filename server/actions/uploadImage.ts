"use server";

import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import { PassThrough } from "stream";

export async function uploadImage(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    // Check size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "File size exceeds 5MB limit" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "roomy_rooms" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            resolve({ error: `Cloudinary error: ${error.message || JSON.stringify(error)}` });
          } else {
            resolve({ url: result?.secure_url });
          }
        }
      );

      const passThrough = new PassThrough();
      passThrough.end(buffer);
      passThrough.pipe(uploadStream);
    });
  } catch (error: any) {
    console.error("Upload Image Server Action Error:", error);
    return { error: error.message || "An unexpected error occurred during upload." };
  }
}
