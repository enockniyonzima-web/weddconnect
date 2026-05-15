"use server";

import { s3Client, BUCKET_NAME, AWS_REGION } from '@/config/awsConfig';
import {
     PutObjectCommand,
     DeleteObjectCommand,
     DeleteObjectsCommand,
} from '@aws-sdk/client-s3';

export const uploadSingleImage = async (file: File, folder:string = "production"): Promise<string> => {
     const arrayBuffer = await file.arrayBuffer();
     const buffer = Buffer.from(arrayBuffer);

     try {
          const params = {
               Bucket: BUCKET_NAME,
               Key: `${folder}/${Date.now()}-${file.name}`,
               Body: buffer,
               ContentType: file.type,
          };
     
          const command = new PutObjectCommand(params);
     
          await s3Client.send(command);

          // `https://${this.bucketName}.s3.${this.configService.getOrThrow('AWS_S3_REGION')}.amazonaws.com/${key}`
     
          return `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`;
     } catch (error) {
          console.log(error);
          return "";
     }
};

export const uploadMultipleImages = async (files: File[], folder: string = "production"): Promise<string[]> => {
     const uploadPromises = files.map((file) => uploadSingleImage(file, folder));
     return Promise.all(uploadPromises);
};

export const uploadImagesFromFormData = async (formData: FormData, folder: string = "production"): Promise<string[]> => {
     const files = formData.getAll("images") as File[];
     return Promise.all(files.map((file) => uploadSingleImage(file, folder)));
};

// export const deleteSingleImage = async (key: string): Promise<void> => {
//      const params = { Bucket: BUCKET_NAME, Key: key };
//      const command = new DeleteObjectCommand(params);

//      await s3Client.send(command);
// };

export const deleteSingleImage = async (imageUrl: string): Promise<void> => {
     try {
       // Extract the key from the image URL
       if(!imageUrl) return;
          const bucketDomain = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`;
          if (!imageUrl.startsWith(bucketDomain)) {
              return;
          }
     
          // Extract the key portion (folder/filename)
          const key = imageUrl.replace(bucketDomain, "");

          if (!key) {
               return;
          }

       // Delete the object using the extracted key
          const params = { Bucket: BUCKET_NAME, Key: key };
          const command = new DeleteObjectCommand(params);
     
          await s3Client.send(command);
          console.log(`Image with key "${key}" deleted successfully.`);
     } catch (error) {
          throw error;
     }
};

export const deleteMultipleImages = async (keys: string[]): Promise<void> => {
     const objects = keys.map((key) => ({ Key: key }));
     const params = {
          Bucket: BUCKET_NAME,
          Delete: { Objects: objects },
     };

     const command = new DeleteObjectsCommand(params);

     await s3Client.send(command);
};
