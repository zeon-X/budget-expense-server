import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface UploadedPhoto {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

interface ImgBBResponse {
  success: boolean;
  data?: {
    url: string;
    display_url: string;
    delete_url: string;
  };
  error?: {
    message: string;
  };
}

@Injectable()
export class TransactionPhotoService {
  constructor(private readonly configService: ConfigService) {}

  async uploadPhoto(file?: UploadedPhoto): Promise<string | undefined> {
    if (!file) {
      return undefined;
    }

    const apiKey = this.configService.get<string>("IMGBB_API_KEY");

    if (!apiKey) {
      throw new InternalServerErrorException("ImgBB API key is not configured");
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException("Uploaded photo is empty");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestException("Only image files are allowed");
    }

    const base64Image = file.buffer.toString("base64");

    const formData = new URLSearchParams();

    formData.append("key", apiKey);
    formData.append("image", base64Image);

    try {
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const result = (await response.json()) as ImgBBResponse;

      if (!response.ok || !result.success || !result.data) {
        throw new InternalServerErrorException(
          result.error?.message ?? "Failed to upload photo to ImgBB",
        );
      }

      return result.data.url;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException("Failed to upload photo");
    }
  }
}
