const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAdmin() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true
      }
    })

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔍 KIỂM TRA ADMIN USER')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    if (admins.length === 0) {
      console.log('❌ KHÔNG CÓ ADMIN USER!')
      console.log('\n📝 Cần tạo admin user bằng một trong các cách sau:')
      console.log('1. npm run admin:create')
      console.log('2. npm run admin:set your@email.com')
      console.log('3. Chạy SQL: UPDATE users SET role = \'ADMIN\' WHERE email = \'your@email.com\'')
    } else {
      console.log(`✅ Tìm thấy ${admins.length} admin user(s):\n`)
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ID: ${admin.id}`)
        console.log(`   Email: ${admin.email}`)
        console.log(`   Name: ${admin.name || '(chưa có tên)'}`)
        console.log(`   Provider: ${admin.provider}`)
        console.log('')
      })
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  } catch (error) {
    console.error('❌ Lỗi:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdmin()
