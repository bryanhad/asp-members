import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
})

export const uploadImage = async (buffer: Uint8Array, folder:string) => {
    const res = (await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder,
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

export const updateImage = async (buffer: Uint8Array, folder:string, publicImgId:string) => {
    const res = (await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder,
                    public_id: publicImgId
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

export const deleteImage = async (publicImgId:string, folder:string) => {
    await cloudinary.uploader.destroy(`${folder}/${publicImgId}`)
} 

export default cloudinary
