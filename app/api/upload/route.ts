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
    const fileExists = fs.existsSync(filePath)

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

    // Save the file to public/images
    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

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
