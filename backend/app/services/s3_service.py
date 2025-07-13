import boto3
import os
from botocore.config import Config
from fastapi import UploadFile
from app.core.config import settings
import tempfile
from datetime import datetime

class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            endpoint_url=settings.S3_ENDPOINT_URL,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=Config(signature_version='s3v4'),
            region_name=settings.AWS_REGION
        )
        self.bucket_name = settings.S3_BUCKET_NAME

    async def upload_file(self, file: UploadFile) -> str:
        """
        Upload a file to S3
        """
        try:
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                content = await file.read()
                temp_file.write(content)
                temp_file.flush()

                # Upload to S3
                file_key = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{sanitized(file.filename)}"
                self.s3_client.upload_file(
                    sanitized(temp_file.name),
                    self.bucket_name,
                    file_key,
                    ExtraArgs={'ContentType': file.content_type}
                )

                # Generate URL
                url = self.s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': self.bucket_name, 'Key': file_key},
                    ExpiresIn=3600
                )

                return url
        finally:
            # Clean up temporary file
            if 'temp_file' in locals():
                os.unlink(temp_file.name)

    async def list_files(self) -> list:
        """
        List all files in the bucket
        """
        response = self.s3_client.list_objects_v2(Bucket=self.bucket_name)
        files = []
        
        if 'Contents' in response:
            for obj in response['Contents']:
                url = self.s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': self.bucket_name, 'Key': obj['Key']},
                    ExpiresIn=3600
                )
                files.append({
                    "filename": obj['Key'].strip(),
                    "url": url,
                    "size": obj['Size'],
                    "created_at": obj['LastModified'].isoformat()
                })
        
        return files

    async def download_file(self, file_key: str) -> str:
        """
        Download a file from S3
        """
        try:
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                self.s3_client.download_fileobj(
                    self.bucket_name,
                    file_key,
                    temp_file
                )
                return temp_file.name
        except Exception as e:
            raise Exception(f"Error downloading file: {str(e)}")
        
    async def get_file_metadata(self, file_id: str) -> dict:
        """
        Get metadata of a file in S3
        """
        try:
            response = self.s3_client.head_object(Bucket=self.bucket_name, Key=file_id)
            return {
                "filename": file_id,
                "size": response['ContentLength'],
                "content_type": response['ContentType'],
                "last_modified": response['LastModified'].isoformat()
            }
        except Exception as e:
            raise Exception(f"Error retrieving file metadata: {str(e)}")

    async def delete_file(self, file_key: str) -> None:
        """
        Delete a file from S3
        """
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=file_key
            )
        except Exception as e:
            raise Exception(f"Error deleting file: {str(e)}") 
        
def sanitized(filename: str) -> str:
    # Remove all spaces and convert to lowercase
    return filename.replace(' ', '').lower()
