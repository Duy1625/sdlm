import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE /api/comments/[id] - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const commentId = parseInt(params.id)

    // Get the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment không tồn tại' },
        { status: 404 }
      )
    }

    // Check permissions
    const isOwner = session?.user?.id && comment.userId === parseInt(session.user.id)
    const isAdmin = session?.user?.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Bạn không có quyền xóa comment này' },
        { status: 403 }
      )
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json(
      { success: false, error: 'Lỗi khi xóa comment' },
      { status: 500 }
    )
  }
}
