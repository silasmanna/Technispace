/**
 * Cloudinary unsigned upload helper
 * ─────────────────────────────────
 * Setup steps:
 *  1. Sign in at cloudinary.com → Settings → Upload Presets
 *  2. Create a preset named "technispace_unsigned" with Signing Mode = "Unsigned"
 *  3. Add your Cloud Name to .env as VITE_CLOUDINARY_CLOUD_NAME
 *
 * Folders created automatically:
 *   - technispace/properties/   (listing photos)
 *   - technispace/kyc/          (KYC documents)
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'technispace_unsigned';

export const isCloudinaryConfigured =
  CLOUD_NAME && !CLOUD_NAME.includes('your_');

/**
 * Upload a single File to Cloudinary.
 * @param {File} file
 * @param {string} folder  - e.g. "technispace/properties"
 * @param {(pct: number) => void} onProgress
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadToCloudinary(file, folder = 'technispace/properties', onProgress) {
  if (!isCloudinaryConfigured) {
    // Fallback: return a mock Unsplash URL in demo mode
    await new Promise(r => setTimeout(r, 800));
    if (onProgress) onProgress(100);
    return {
      url: `https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80&t=${Date.now()}`,
      publicId: `demo/${Date.now()}`,
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({ url: data.secure_url, publicId: data.public_id });
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

/**
 * Upload multiple files sequentially, calling onFileComplete after each.
 */
export async function uploadMultiple(files, folder, onFileComplete) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const result = await uploadToCloudinary(
      files[i],
      folder,
      (pct) => onFileComplete && onFileComplete(i, pct, 'uploading'),
    );
    results.push(result);
    if (onFileComplete) onFileComplete(i, 100, 'done', result.url);
  }
  return results;
}
