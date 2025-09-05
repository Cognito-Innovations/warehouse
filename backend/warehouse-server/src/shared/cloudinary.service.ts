import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

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

@Injectable()
export class CloudinaryService {
  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary credentials not found. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
    }
  }

  async uploadFile(file: any, folder: string = 'warehouse'): Promise<CloudinaryUploadResult> {
    try {
      // Convert buffer to base64 for Cloudinary upload
      const base64String = file.buffer.toString('base64');
      const dataUri = `data:${file.mimetype};base64,${base64String}`;
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: folder,
        resource_type: file.mimetype.startsWith('image/') ? 'image' : 'raw',
        public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`,
        overwrite: false,
        invalidate: true,
        transformation: file.mimetype.startsWith('image/') ? [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ] : []
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
    } catch (error) {
      throw new BadRequestException(`Failed to upload file to Cloudinary: ${error.message}`);
    }
  }

  async uploadMultipleFiles(files: any[], folder: string = 'warehouse'): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteFile(publicId: string): Promise<{ result: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return { result: result.result };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file from Cloudinary: ${error.message}`);
    }
  }

  async deleteMultipleFiles(publicIds: string[]): Promise<{ result: string }> {
    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      return { result: result.result };
    } catch (error) {
      throw new BadRequestException(`Failed to delete files from Cloudinary: ${error.message}`);
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
  generateOptimizedUrl(publicId: string, options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}): string {
    const { width, height, quality = 'auto', format = 'auto' } = options;
    
    // Use Cloudinary's URL helper
    return cloudinary.url(publicId, {
      width,
      height,
      quality,
      format,
      secure: true
    });
  }
}
