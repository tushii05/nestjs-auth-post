import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  async saveFile(file: Express.Multer.File, folder: string, filename?: string): Promise<string> {
    const uploadPath = `./uploads/${folder}`;

    // Ensure folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const fileExt = extname(file.originalname);
    const safeName = filename ? filename + fileExt : uuidv4() + fileExt;

    const filePath = `${uploadPath}/${safeName}`;

    // Save the buffer
    fs.writeFileSync(filePath, file.buffer);

    return `${folder}/${safeName}`; 
  }

  deleteFile(relativePath: string) {
    const filePath = `./uploads/${relativePath}`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}
