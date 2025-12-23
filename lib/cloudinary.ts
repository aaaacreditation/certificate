import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(
    imageBuffer: Buffer,
    folder: string = 'certificates'
): Promise<string> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image',
                format: 'png',
            },
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result?.secure_url || '')
                }
            }
        ).end(imageBuffer)
    })
}

export async function deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId)
}

export default cloudinary
