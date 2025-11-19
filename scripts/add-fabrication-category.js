const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addFabricationCategory() {
  try {
    console.log('🔧 Đang thêm danh mục Sửa chữa & Gia công...')

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

    // Create subcategories for metal fabrication services
    const subcategories = [
      {
        name: 'Gia công cửa sắt, nhôm',
        slug: 'gia-cong-cua-sat-nhom',
        description: 'Gia công, lắp đặt cửa sắt, cửa nhôm, cửa kính',
        icon: '🚪',
        parentId: serviceCategory.id,
      },
      {
        name: 'Hàng rào - Mái che',
        slug: 'hang-rao-mai-che',
        description: 'Thi công hàng rào sắt, mái che, mái xếp',
        icon: '🏗️',
        parentId: serviceCategory.id,
      },
      {
        name: 'Tủ - Kệ - Vách ngăn',
        slug: 'tu-ke-vach-ngan',
        description: 'Gia công tủ nhôm, kệ sắt, vách ngăn, vách kính',
        icon: '🗄️',
        parentId: serviceCategory.id,
      },
      {
        name: 'Sửa chữa kim loại',
        slug: 'sua-chua-kim-loai',
        description: 'Sửa chữa đồ sắt, nhôm, kính tận nơi',
        icon: '🔧',
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

    console.log('\n🎉 Hoàn tất! Danh mục "Gia công cửa sắt, nhôm" đã sẵn sàng.')
  } catch (error) {
    console.error('❌ Lỗi:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

addFabricationCategory()
