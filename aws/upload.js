var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-south-1"
});

const s3 = new AWS.S3();

const upload = async (file) => {
    if(!file){
        return { Location: null }
    }
    console.log(file);
    const params = {
        Bucket: 'custom-segment-data',
        Key: Date.now() + file.originalname,
        Body: Buffer.from(file.buffer, 'binary')
    }
    return await s3.upload(params).promise();
}

module.exports = upload;