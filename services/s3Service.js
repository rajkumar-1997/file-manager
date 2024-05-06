import AWS from 'aws-sdk';
import fs from 'fs';

const uploadFileToS3 = async (filePath, filename) => {
  try {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_ACCESS_KEY = process.env.IAM_ACCESS_KEY;
    const IAM_SECRET_KEY = process.env.IAM_SECRET_KEY;

    // Creating an instance of the S3 service object
    const s3 = new AWS.S3({
      accessKeyId: IAM_ACCESS_KEY,
      secretAccessKey: IAM_SECRET_KEY,
    });
    const fileStream = fs.createReadStream(filePath);
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: fileStream,
      ACL: 'public-read',
    };

    // Upload the file to S3
    const data = await s3.upload(uploadParams).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

const deleteFileFromS3 = async (fileURL) => {
  try {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_ACCESS_KEY = process.env.IAM_ACCESS_KEY;
    const IAM_SECRET_KEY = process.env.IAM_SECRET_KEY;
    const s3 = new AWS.S3({
      accessKeyId: IAM_ACCESS_KEY,
      secretAccessKey: IAM_SECRET_KEY,
    });
    const params = {
      Bucket: BUCKET_NAME,
      Key: decodeURI(fileURL.split('/').pop()), // Extract the filename from the fileURL
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
};
export default { uploadFileToS3, deleteFileFromS3 };
