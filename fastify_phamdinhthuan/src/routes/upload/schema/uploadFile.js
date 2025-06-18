const uploadFileSchema = {
    description: 'Upload a file',
    tags: ['file'],
    summary: 'Uploads a file to the server',
    consumes: ['multipart/form-data'],
    response:{
        200: {
            description: 'Successful upload',
            type: 'object',
            properties: {
            message: { type: 'string' },
            url: { type: 'string' },
            filename: { type: 'string' }
            }
        },
        500: {
            description: 'Failed upload',
            type: 'object',
            properties: {
                message: { type: 'string' }

            }
        }
    }
}
module.exports = uploadFileSchema;