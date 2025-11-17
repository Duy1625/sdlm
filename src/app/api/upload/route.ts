import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Không có file được upload' },
        { status: 400 }
      )
    }

    // Validate file name and size
    if (!file.name || file.size === 0) {
      return NextResponse.json(
        { success: false, error: 'File không hợp lệ hoặc rỗng' },
        { status: 400 }
      )
    }

    // Check file type
    const fileType = file.type.split('/')[0]
    if (fileType !== 'image' && fileType !== 'video') {
      return NextResponse.json(
        { success: false, error: 'Chỉ hỗ trợ file ảnh hoặc video' },
        { status: 400 }
      )
    }

    // Check file size (images: 10MB, videos: 100MB)
    const maxSize = fileType === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File ${fileType === 'image' ? 'ảnh' : 'video'} quá lớn. Tối đa ${fileType === 'image' ? '10MB' : '100MB'}` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: fileType === 'image' ? 'listings/images' : 'listings/videos',
          resource_type: fileType === 'video' ? 'video' : 'image',
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      uploadStream.end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      type: fileType,
      publicId: result.public_id
    })

  } catch (error) {
    console.error('Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Lỗi khi upload file'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
