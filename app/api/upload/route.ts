import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const checkOnly = formData.get('checkOnly') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const filename = file.name.replace(/\s+/g, '-').toLowerCase()
    const folder = (formData.get('folder') as string) || 'images'
    const publicTargetDir = path.join(process.cwd(), 'public', folder)
    
    // Ensure target directory exists
    if (!fs.existsSync(publicTargetDir)) {
      fs.mkdirSync(publicTargetDir, { recursive: true })
    }

    const filePath = path.join(publicTargetDir, filename)
    const fileUrl = `/${folder}/${filename}`

    const overwrite = formData.get('overwrite') === 'true'

    // Check if file already exists
    let fileExists = false
    try {
      fileExists = fs.existsSync(filePath)
    } catch (e) {
      fileExists = false
    }

    if (fileExists && !overwrite) {
      return NextResponse.json({ 
        exists: true, 
        url: fileUrl, 
        message: 'An image with this filename already exists.' 
      })
    }

    if (checkOnly) {
      return NextResponse.json({ exists: false })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    try {
      // Ensure target directory exists
      if (!fs.existsSync(publicTargetDir)) {
        fs.mkdirSync(publicTargetDir, { recursive: true })
      }

      // Save the file to public/images
      fs.writeFileSync(filePath, buffer)
    } catch (writeError: any) {
      console.warn('Writing to local filesystem failed, falling back to base64 data URL:', writeError.message);
      
      // Convert buffer to base64 Data URL fallback
      const base64Data = buffer.toString('base64');
      const mimeType = file.type || 'image/png';
      const fallbackUrl = `data:${mimeType};base64,${base64Data}`;
      
      return NextResponse.json({ 
        exists: false, 
        url: fallbackUrl, 
        message: 'Image uploaded successfully (base64 fallback due to read-only filesystem).' 
      })
    }

    return NextResponse.json({ 
      exists: false, 
      url: fileUrl, 
      message: 'Image uploaded successfully.' 
    })
  } catch (error: any) {
    console.error('Upload image error:', error)
    return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 })
  }
}
