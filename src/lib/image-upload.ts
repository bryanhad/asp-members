import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
})

export const uploadImage = async (buffer: Uint8Array) => {
    const res = (await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    tags: ['member-picture'],
                },
                (err, res) => {
                    if (err || !res) {
                        reject(err)
                        return
                    }
                    resolve(res)
                }
            )
            .end(buffer)
    })) as UploadApiResponse
    return res
}

export const deleteImage = async (publicImgId:string) => {
    await cloudinary.uploader.destroy(publicImgId)
} 

export default cloudinary
