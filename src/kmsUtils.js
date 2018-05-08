import aws from 'aws-sdk';
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_MASTER_KEY_ID,
} from './secrets';

export function encrypt(buffer) {
  const kms = new aws.KMS({
    accessKeyId: AWS_ACCESS_KEY_ID, //credentials for your IAM user
    secretAccessKey: AWS_SECRET_ACCESS_KEY, //credentials for your IAM user
    region: AWS_REGION,
  });
  return new Promise((resolve, reject) => {
    const params = {
      KeyId: AWS_MASTER_KEY_ID, // The identifier of the CMK to use for encryption. You can use the key ID or Amazon Resource Name (ARN) of the CMK, or the name or ARN of an alias that refers to the CMK.
      Plaintext: buffer, // The data to encrypt.
    };
    kms.encrypt(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.CiphertextBlob);
      }
    });
  });
}

export function decrypt(buffer) {
  const kms = new aws.KMS({
    accessKeyId: AWS_ACCESS_KEY_ID, //credentials for your IAM user
    secretAccessKey: AWS_SECRET_ACCESS_KEY, //credentials for your IAM user
    region: AWS_REGION,
  });
  return new Promise((resolve, reject) => {
    const params = {
      CiphertextBlob: buffer, // The data to dencrypt.
    };
    kms.decrypt(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Plaintext);
      }
    });
  });
}
