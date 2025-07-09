import multer from 'multer';
import { resolve } from 'node:path';

const tempDir = resolve('temp');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, tempDir);
  },
  filename: (req, file, callback) => {
    const filename = `${Date.now()}_${file.originalname}`;
    callback(null, filename);
  },
});

export const upload = multer({ storage });
