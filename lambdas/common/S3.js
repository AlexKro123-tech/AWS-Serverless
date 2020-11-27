const AWS = require('aws-sdk');
const { write } = require('fs');
const { get } = require('./Dynamo');

const s3Client = new AWS.S3();

const S3 = {
    async get() {

    },

    async write(data, fileName, bucket) {
        const params = {
            Bucket: bucket,
            Body: JSON.stringify(data),
            Key: fileName
        };

        const newData = await s3Client.putObject(params).promise();

        if (!newData){
            throw Error(`there was an error writing a file ${fileName}`);
        }

        return newData;
    },
}

module.exports = S3;