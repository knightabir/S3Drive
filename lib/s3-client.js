import { S3Client } from '@aws-sdk/client-s3';

export function getS3Client(credentials) {
    return new S3Client({
        region: credentials.region,
        credentials: {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
        },
        maxAttempts: 3, // Retry failed requests up to 3 times
    });
}

// Optional retry wrapper for critical operations
export async function retryOperation(operation, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (err) {
            if (attempt === maxRetries) throw err;
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
    }
    throw new Error('Operation failed after retries');
}