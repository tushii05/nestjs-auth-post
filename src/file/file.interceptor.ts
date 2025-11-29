import { FileInterceptor } from '@nestjs/platform-express';

export const FileUploadInterceptor = (field: string) =>
  FileInterceptor(field, {
    storage: {
      _handleFile(req, file, cb) {
        const chunks: any[] = [];
        file.stream.on('data', (chunk) => chunks.push(chunk));
        file.stream.on('end', () => {
          file.buffer = Buffer.concat(chunks);
          cb(null, { buffer: file.buffer, size: file.buffer.length });
        });
        file.stream.on('error', (err) => cb(err));
      },
      _removeFile(req, file, cb) {
        cb(null);
      },
    },
  });
