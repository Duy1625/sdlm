const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setUserAsAdmin() {
  try {
    // Thay email này bằng email của bạn
    const email = process.argv[2]

    if (!email) {
      console.log('❌ Vui lòng cung cấp email!')
      console.log('Cách dùng: node scripts/set-user-as-admin.js <email>')
      console.log('Ví dụ: node scripts/set-user-as-admin.js your@email.com')
      process.exit(1)
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log(`❌ Không tìm thấy user với email: ${email}`)
      process.exit(1)
    }

    if (user.role === 'ADMIN') {
      console.log('✅ User này đã là ADMIN rồi!')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📧 Email:', user.email)
      console.log('👤 Tên:', user.name)
      console.log('🎭 Role:', user.role)
      console.log('🔐 Provider:', user.provider)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return
    }

    // Update to admin
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })

    console.log('✅ Đã cập nhật thành ADMIN thành công!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', user.email)
    console.log('👤 Tên:', user.name)
    console.log('🎭 Role: USER → ADMIN')
    console.log('🔐 Provider:', user.provider)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🌐 Đăng nhập lại tại: http://localhost:3000/login')

  } catch (error) {
    console.error('❌ Lỗi:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setUserAsAdmin()
