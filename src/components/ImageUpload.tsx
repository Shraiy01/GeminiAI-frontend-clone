import React, { forwardRef } from 'react';

interface ImageUploadProps {
  onImageUpload: (imageData: string) => void;
}

const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  ({ onImageUpload }, ref) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUpload(result);
      };
      reader.readAsDataURL(file);

      // Reset input
      if (e.target) {
        e.target.value = '';
      }
    };

    return (
      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    );
  }
);

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;