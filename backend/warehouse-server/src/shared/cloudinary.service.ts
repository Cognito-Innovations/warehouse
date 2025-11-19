import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse } from 'cloudinary';
import { Express } from 'express';

// Cloudinary upload result interface
interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
}

interface DestroyApiResponse {
  result: string;
}

@Injectable()
export class CloudinaryService {
  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.warn(
        'Cloudinary credentials not found. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.',
      );
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'warehouse',
  ): Promise<CloudinaryUploadResult> {
    try {
      // Convert buffer to base64 for Cloudinary upload
      const base64String = file.buffer.toString('base64');
      const dataUri = `data:${file.mimetype};base64,${base64String}`;

      const isImage = file.mimetype.startsWith('image/');
      const resourceType = isImage ? 'image' : 'auto';

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: resourceType,
        public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`,
        overwrite: false,
        invalidate: true,
        transformation: isImage
          ? [{ quality: 'auto' }, { fetch_format: 'auto' }]
          : [],
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
      };
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as UploadApiErrorResponse).message)
          : 'Unknown error';
      throw new BadRequestException(
        `Failed to upload file to Cloudinary: ${message}`,
      );
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'warehouse',
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    const results = await Promise.allSettled(uploadPromises);
    return results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);
  }

  async deleteFile(publicId: string): Promise<{ result: string }> {
    try {
      const result: { result?: string } = (await cloudinary.uploader.destroy(
        publicId,
      )) as DestroyApiResponse;
      return { result: result.result ?? 'ok' };
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as UploadApiErrorResponse).message)
          : 'Unknown error';
      throw new BadRequestException(
        `Failed to delete file from Cloudinary: ${message}`,
      );
    }
  }

  async deleteMultipleFiles(publicIds: string[]): Promise<{ result: string }> {
    try {
      const result = (await cloudinary.api.delete_resources(
        publicIds,
      )) as DestroyApiResponse;
      return { result: result.result ?? 'ok' };
    } catch (error: unknown) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as UploadApiErrorResponse).message)
          : 'Unknown error';
      throw new BadRequestException(
        `Failed to delete files from Cloudinary: ${message}`,
      );
    }
  }

  // Helper method to extract public_id from URL
  extractPublicId(url: string): string {
    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const match = url.match(/\/upload\/v\d+\/(.+?)\./);
    if (match) {
      return match[1];
    }

    // Fallback: extract from the end of URL
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  }

  // Helper method to generate optimized image URL
  generateOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: string;
      format?: string;
    } = {},
  ): string {
    const { width, height, quality = 'auto', format = 'auto' } = options;

    // Use Cloudinary's URL helper
    return cloudinary.url(publicId, {
      width,
      height,
      quality,
      format,
      secure: true,
    });
  }
}
