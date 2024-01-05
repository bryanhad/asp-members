import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
})

type UploadResult = {
    asset_id: string
    public_id: string
    width: number
    height: number
    format: string
    created_at: string
    tags: string[]
    bytes: number
    secure_url: string
}

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

export default cloudinary
