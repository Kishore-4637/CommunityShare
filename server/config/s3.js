import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const isS3Configured = Boolean(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET
);

let s3Client = null;
if (isS3Configured) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Uploads a file buffer either to AWS S3 or fallback to local disk storage
 * @param {Buffer} buffer File buffer
 * @param {string} originalname Original filename
 * @param {string} mimetype MIME type
 * @returns {Promise<string>} Public URL of uploaded image
 */
export const uploadFileToStorage = async (buffer, originalname, mimetype) => {
  const extension = path.extname(originalname) || '.jpg';
  const cleanBase = path.basename(originalname, extension).replace(/[^a-zA-Z0-9_-]/g, '');
  const key = `items/${Date.now()}-${cleanBase || 'upload'}${extension}`;

  if (isS3Configured && s3Client) {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
      });
      await s3Client.send(command);
      const region = process.env.AWS_REGION || 'us-east-1';
      return `https://${process.env.AWS_S3_BUCKET}.s3.${region}.amazonaws.com/${key}`;
    } catch (err) {
      console.warn('[Storage] S3 upload failed, falling back to local disk storage:', err.message);
    }
  }

  // Local file storage fallback
  const filename = `${Date.now()}-${cleanBase || 'upload'}${extension}`;
  const localFilePath = path.join(uploadsDir, filename);
  await fs.promises.writeFile(localFilePath, buffer);
  return `/uploads/${filename}`;
};
