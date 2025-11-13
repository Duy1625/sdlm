const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    const email = 'admin@wedosa.com'
    const password = 'admin123456' // Đổi mật khẩu này!
    const name = 'Administrator'

    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('❌ Tài khoản admin đã tồn tại!')
      console.log('Email:', existingUser.email)
      console.log('Role:', existingUser.role)

      if (existingUser.role !== 'ADMIN') {
        console.log('\n🔄 Cập nhật role thành ADMIN...')
        await prisma.user.update({
          where: { email },
          data: { role: 'ADMIN' }
        })
        console.log('✅ Đã cập nhật role thành ADMIN!')
      }

      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        provider: 'credentials'
      }
    })

    console.log('✅ Tạo tài khoản admin thành công!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Mật khẩu:', password)
    console.log('👤 Tên:', admin.name)
    console.log('🎭 Role:', admin.role)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n⚠️  LƯU Ý: Hãy đổi mật khẩu sau khi đăng nhập lần đầu!')
    console.log('\n🌐 Đăng nhập tại: http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Lỗi:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
