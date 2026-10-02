/**
 * Cloudinary Integration Helper for i-Shoots Luxe Portfolio
 */

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "khbq2snz",
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || "913265267773198",
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || "WXgDcjVSPm9H_8dLNSKmmHv1rgM",
  baseUrl: "https://res.cloudinary.com/khbq2snz",
};

interface TransformationOptions {
  width?: number;
  height?: number;
  crop?: "scale" | "fit" | "fill" | "limit" | "pad" | "crop" | "thumb";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "jpg" | "png" | "avif";
  gravity?: "auto" | "face" | "center";
}

/**
 * Constructs an optimized Cloudinary Image or Video URL with transformations.
 */
export function buildCloudinaryUrl(
  publicId: string,
  options: TransformationOptions = {}
): string {
  if (!publicId) return "";

  if (publicId.startsWith("http://") || publicId.startsWith("https://")) {
    if (!publicId.includes("res.cloudinary.com")) {
      return publicId;
    }
  }

  const cleanPublicId = publicId.replace(/^https?:\/\/res\.cloudinary\.com\/[^\/]+\/(image|video)\/upload\/(v\d+\/)?/, "");

  const transformations: string[] = [];
  const format = options.format || "auto";
  const quality = options.quality || "auto";

  transformations.push(`f_${format}`);
  transformations.push(`q_${quality}`);

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);

  const transformString = transformations.join(",");

  return `${cloudinaryConfig.baseUrl}/image/upload/${transformString}/${cleanPublicId}`;
}

/**
 * Generates SHA-1 signature for authenticated Cloudinary signed uploads
 */
async function generateSignature(timestamp: number, apiSecret: string): Promise<string> {
  const str = `timestamp=${timestamp}${apiSecret}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Validates Cloudinary environment settings before initiating requests
 */
function validateConfig() {
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey) {
    throw new Error(
      "Cloudinary configuration invalid. Please check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_API_KEY environment variables."
    );
  }
}

/**
 * Fast XMLHttpRequest upload to Cloudinary with real-time progress monitoring (0-100%).
 * Supports automatic fallback to authenticated signed upload if unsigned preset is missing.
 */
export async function uploadToCloudinaryWithProgress(
  file: File,
  onProgress?: (percent: number) => void,
  uploadPreset = "ishoots_preset"
): Promise<{ secure_url: string; public_id: string; resource_type: string; format: string }> {
  validateConfig();

  // Try signed upload first if API secret is available (bypasses upload_preset dependency completely)
  if (cloudinaryConfig.apiSecret) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await generateSignature(timestamp, cloudinaryConfig.apiSecret);

      return await new Promise((resolve, reject) => {
        const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`;
        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        formData.append("file", file);
        formData.append("api_key", cloudinaryConfig.apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (err) {
              reject(new Error("Invalid response from Cloudinary"));
            }
          } else {
            try {
              const errJson = JSON.parse(xhr.responseText);
              reject(new Error(errJson.error?.message || `Upload failed (${xhr.status})`));
            } catch {
              reject(new Error(`Upload failed (${xhr.status})`));
            }
          }
        };

        xhr.onerror = () => reject(new Error("Network connection error during upload"));
        xhr.ontimeout = () => reject(new Error("Upload request timed out"));

        xhr.open("POST", url, true);
        xhr.send(formData);
      });
    } catch (signedErr: any) {
      console.warn("Signed upload fallback warning, attempting unsigned upload preset:", signedErr);
    }
  }

  // Fallback to Unsigned upload if signature fails
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("api_key", cloudinaryConfig.apiKey);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (err) {
          reject(new Error("Invalid response from Cloudinary"));
        }
      } else {
        try {
          const errJson = JSON.parse(xhr.responseText);
          reject(new Error(errJson.error?.message || `Upload failed (${xhr.status})`));
        } catch {
          reject(new Error(`Upload failed (${xhr.status})`));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network connection error during upload"));
    xhr.ontimeout = () => reject(new Error("Upload request timed out"));

    xhr.open("POST", url, true);
    xhr.send(formData);
  });
}

/**
 * Standard fetch upload helper
 */
export async function uploadToCloudinary(file: File, uploadPreset = "ishoots_preset") {
  return uploadToCloudinaryWithProgress(file, undefined, uploadPreset);
}

export default cloudinaryConfig;
