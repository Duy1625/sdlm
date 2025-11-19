const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addVehicleRentalCategory() {
  try {
    console.log('🚗 Đang thêm danh mục Cho thuê xe...')

    // Check if "Xe cộ" category exists
    let vehicleCategory = await prisma.category.findFirst({
      where: { slug: 'xe-co' }
    })

    // If not, create it
    if (!vehicleCategory) {
      vehicleCategory = await prisma.category.create({
        data: {
          name: 'Xe cộ',
          slug: 'xe-co',
          description: 'Xe máy, ô tô, xe đạp và phương tiện giao thông',
          icon: '🚗',
        },
      })
      console.log('✅ Đã tạo danh mục cha: Xe cộ')
    } else {
      console.log('✅ Đã tồn tại danh mục: Xe cộ')
    }

    // Create subcategories for vehicle rental
    const subcategories = [
      {
        name: 'Cho thuê xe máy',
        slug: 'cho-thue-xe-may',
        description: 'Cho thuê xe máy theo ngày, tháng',
        icon: '🛵',
        parentId: vehicleCategory.id,
      },
      {
        name: 'Cho thuê ô tô',
        slug: 'cho-thue-o-to',
        description: 'Cho thuê ô tô tự lái, có tài xế',
        icon: '🚗',
        parentId: vehicleCategory.id,
      },
      {
        name: 'Cho thuê xe tải',
        slug: 'cho-thue-xe-tai',
        description: 'Cho thuê xe tải chở hàng, chuyển nhà',
        icon: '🚚',
        parentId: vehicleCategory.id,
      },
      {
        name: 'Cho thuê xe đạp',
        slug: 'cho-thue-xe-dap',
        description: 'Cho thuê xe đạp thường, xe đạp điện',
        icon: '🚲',
        parentId: vehicleCategory.id,
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

    console.log('\n🎉 Hoàn tất! Danh mục "Cho thuê xe" đã sẵn sàng.')
  } catch (error) {
    console.error('❌ Lỗi:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

addVehicleRentalCategory()
