import { useCallback } from 'react';

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export const useCloudinary = () => {
    const uploadToCloudinary = useCallback(async (file, folder) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', folder);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error('Failed to upload to Cloudinary');
        }

        return await response.json();
    }, []);

    const deleteFromCloudinary = useCallback(async (publicId) => {
        // Note: Cloudinary deletion should typically be handled through your backend
        // for security reasons. This is just for demonstration.
        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error('Failed to delete from Cloudinary');
        }

        return await response.json();
    }, []);

    return {
        uploadToCloudinary,
        deleteFromCloudinary
    };
}; 