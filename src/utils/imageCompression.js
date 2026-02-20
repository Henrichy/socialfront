/**
 * Image compression utility for reducing file size and quality
 * Supports JPEG, PNG, and WebP formats
 */

/**
 * Compress an image file to reduce its size
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width (default: 800)
 * @param {number} options.maxHeight - Maximum height (default: 600)
 * @param {number} options.quality - Image quality 0-1 (default: 0.7)
 * @param {string} options.outputFormat - Output format: 'jpeg', 'png', 'webp' (default: 'jpeg')
 * @returns {Promise<string>} Base64 encoded compressed image
 */
export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 800,
      maxHeight = 600,
      quality = 0.7,
      outputFormat = 'jpeg'
    } = options;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        
        if (width > height) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with compression
      const mimeType = `image/${outputFormat}`;
      const compressedDataUrl = canvas.toDataURL(mimeType, quality);

      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Create object URL for the image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Compress multiple images
 * @param {FileList|Array} files - Array of image files
 * @param {Object} options - Compression options (same as compressImage)
 * @returns {Promise<Array>} Array of base64 encoded compressed images
 */
export const compressMultipleImages = async (files, options = {}) => {
  const promises = Array.from(files).map(file => compressImage(file, options));
  return Promise.all(promises);
};

/**
 * Get file size in KB from base64 string
 * @param {string} base64String - Base64 encoded image
 * @returns {number} File size in KB
 */
export const getBase64FileSize = (base64String) => {
  const base64Length = base64String.length;
  const sizeInBytes = (base64Length * 3) / 4;
  return Math.round(sizeInBytes / 1024);
};

/**
 * Validate image file before compression
 * @param {File} file - Image file to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSizeMB - Maximum file size in MB (default: 10)
 * @param {Array} options.allowedTypes - Allowed MIME types (default: common image types)
 * @returns {Object} Validation result with isValid and error message
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSizeMB = 10,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  } = options;

  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `File type ${file.type} not allowed. Supported types: ${allowedTypes.join(', ')}` 
    };
  }

  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return { 
      isValid: false, 
      error: `File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed size (${maxSizeMB}MB)` 
    };
  }

  return { isValid: true, error: null };
};

export default {
  compressImage,
  compressMultipleImages,
  getBase64FileSize,
  validateImageFile
};