const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addMechanicalCategory() {
  try {
    console.log('⚙️ Đang thêm danh mục Cơ khí...')

    // Check if "Dịch vụ" category exists
    let serviceCategory = await prisma.category.findFirst({
      where: { slug: 'dich-vu' }
    })

    // If not, create it
    if (!serviceCategory) {
      serviceCategory = await prisma.category.create({
        data: {
          name: 'Dịch vụ',
          slug: 'dich-vu',
          description: 'Các dịch vụ chuyên nghiệp',
          icon: '⚡',
        },
      })
      console.log('✅ Đã tạo danh mục cha: Dịch vụ')
    } else {
      console.log('✅ Đã tồn tại danh mục: Dịch vụ')
    }

    // Create subcategories for mechanical services
    const subcategories = [
      {
        name: 'Gia công cơ khí',
        slug: 'gia-cong-co-khi',
        description: 'Gia công cơ khí, tiện, phay, hàn',
        icon: '⚙️',
        parentId: serviceCategory.id,
      },
      {
        name: 'Sửa chữa máy móc',
        slug: 'sua-chua-may-moc',
        description: 'Sửa chữa, bảo trì máy móc công nghiệp',
        icon: '🔩',
        parentId: serviceCategory.id,
      },
      {
        name: 'Hàn xì',
        slug: 'han-xi',
        description: 'Dịch vụ hàn xì, hàn điện, hàn TIG, MIG',
        icon: '🔥',
        parentId: serviceCategory.id,
      },
      {
        name: 'Tiện - Phay - CNC',
        slug: 'tien-phay-cnc',
        description: 'Gia công tiện, phay, CNC chính xác',
        icon: '⚡',
        parentId: serviceCategory.id,
      },
    ]

    console.log('\n📝 Đang thêm danh mục con...')

    // Insert subcategories
    for (const subcat of subcategories) {
      // Check if exists first
      const existing = await prisma.category.findFirst({
        where: { slug: subcat.slug }
      })

      if (existing) {
        console.log('  ⏭️  Đã tồn tại:', subcat.name)
      } else {
        const created = await prisma.category.create({
          data: subcat,
        })
        console.log('  ✅ Đã tạo:', created.name)
      }
    }

    console.log('\n🎉 Hoàn tất! Danh mục "Cơ khí" đã sẵn sàng.')
  } catch (error) {
    console.error('❌ Lỗi:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

addMechanicalCategory()
