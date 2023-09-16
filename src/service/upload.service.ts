import * as AWS from 'aws-sdk';
import {Injectable, UploadedFile} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadService {
    private s3: AWS.S3;
    private BUCKET_NAME: string;
    constructor(private configService: ConfigService) {
        const region = this.configService.get('AWS_REGION');
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY');
        const secretAccessKey = this.configService.get('AWS_SECRET_KEY');
        const bucketName = this.configService.get('S3_BUCKET_NAME');

        if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
            throw new Error('Environment variables are missing.');
        }

        AWS.config.update({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            }
        });

        this.s3 = new AWS.S3();
        this.BUCKET_NAME = bucketName;
    }

    async upload(@UploadedFile() file): Promise<string> {
        const key = `${Date.now() + file.originalname}`;
        await this.s3.putObject({
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            Bucket: this.BUCKET_NAME,
        }).promise();
        return this.getS3Url(key);
    }

    private getS3Url(key: string): string {
        return `https://${this.BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/${key}`;
    }
}