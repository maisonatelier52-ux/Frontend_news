import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const checkOnly = formData.get('checkOnly') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Upload directly to "magazinegazette" folder as requested
    const folderName = 'magazinegazette'

    if (checkOnly) {
      // Cloudinary automatically handles folders, skip existence check
      return NextResponse.json({ exists: false })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise<{ secure_url: string } | null>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          public_id: file.name.substring(0, file.name.lastIndexOf('.')).replace(/\s+/g, '-').toLowerCase(),
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result || null)
          }
        }
      )
      uploadStream.end(buffer)
    })

    if (!uploadResult) {
      throw new Error('Cloudinary upload returned empty response')
    }

    return NextResponse.json({ 
      exists: false, 
      url: uploadResult.secure_url, 
      message: 'Image uploaded successfully to Cloudinary.' 
    })
  } catch (error: any) {
    console.error('Upload image to Cloudinary error:', error)
    return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 })
  }
}
