'use server'

import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
}).refine((data) => {
  const nameLower = data.name.toLowerCase()
  return !nameLower.includes('admin') && !nameLower.includes('administrator')
}, {
  message: 'Tên không được chứa từ "admin" hoặc "administrator"',
  path: ['name']
})

export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    // Validate input
    const validatedData = registerSchema.parse(data)

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return {
        success: false,
        error: 'Email đã được sử dụng'
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone || null,
        password: hashedPassword,
        provider: 'credentials',
        role: 'USER'
      }
    })

    return {
      success: true,
      message: 'Đăng ký thành công! Vui lòng đăng nhập.'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message
      }
    }

    console.error('Registration error:', error)
    return {
      success: false,
      error: 'Có lỗi xảy ra, vui lòng thử lại'
    }
  }
}
