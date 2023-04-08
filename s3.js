const dotenv = require("dotenv")
const aws = require("aws-sdk")
const crypto = require("crypto")
const { promisify } = require("util")
const randomBytes = promisify(crypto.randomBytes)
dotenv.config()
const fs = require("fs")

const region = process.env.AWS_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const accesskeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const s3 = new aws.S3({
    region,
    accesskeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})
function uploadFile(file) {
    let fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Key: file.filename,
        Body: fileStream
    }
    return s3.upload(uploadParams).promise()
}
function getFileStream(fileKey) {
    const downloadParams = {
        bucket: bucketName,
        key: fileKey,
    }
    let fileStream = s3.getObject(downloadParams).createReadStream()
    return fileStream
}
function listObjects() {
    const params = {
        Bucket: bucketName
    }
    return s3.listObjectsV2(params).promise()
}
async function generateUploadURL() {
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}
module.exports = { generateUploadURL, uploadFile, getFileStream, listObjects }