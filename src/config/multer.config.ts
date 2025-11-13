import { diskStorage } from 'multer';
import { extname } from 'path';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      let dest = 'src/uploads/';
      if (file.fieldname === 'profile') dest += 'profiles/';
      else if (file.fieldname === 'project') dest += 'projects/';
      else if (file.fieldname === 'resume') dest += 'resumes/';
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
    if (file.fieldname === 'profile' || file.fieldname === 'project') {
      if (!file.mimetype.match(/^image\/(jpeg|png|jpg|webp)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
    }
    if (file.fieldname === 'resume') {
      if (!file.mimetype.match(/pdf/)) {
        return cb(new Error('Only PDF files are allowed for resumes!'), false);
      }
    }
    cb(null, true);
  },
}; 