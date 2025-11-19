const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addBeautyCategory() {
  try {
    console.log('🎨 Đang thêm danh mục Làm đẹp...')

    // Create parent category "Làm đẹp"
    const beautyCategory = await prisma.category.create({
      data: {
        name: 'Làm đẹp',
        slug: 'lam-dep',
        description: 'Dịch vụ làm đẹp, chăm sóc sắc đẹp',
        icon: '💅',
      },
    })

    console.log('✅ Đã tạo danh mục cha:', beautyCategory.name)

    // Create subcategories
    const subcategories = [
      {
        name: 'Nail',
        slug: 'nail',
        description: 'Dịch vụ làm nail, sơn móng tay, móng chân',
        icon: '💅',
        parentId: beautyCategory.id,
      },
      {
        name: 'Gội đầu - Massage đầu',
        slug: 'goi-dau-massage-dau',
        description: 'Dịch vụ gội đầu, massage đầu, dưỡng tóc',
        icon: '💆',
        parentId: beautyCategory.id,
      },
      {
        name: 'Waxing - Tẩy lông',
        slug: 'waxing-tay-long',
        description: 'Dịch vụ waxing, tẩy lông, triệt lông',
        icon: '✨',
        parentId: beautyCategory.id,
      },
      {
        name: 'Spa - Chăm sóc da',
        slug: 'spa-cham-soc-da',
        description: 'Spa, chăm sóc da mặt, massage body',
        icon: '🧖',
        parentId: beautyCategory.id,
      },
      {
        name: 'Makeup - Trang điểm',
        slug: 'makeup-trang-diem',
        description: 'Dịch vụ trang điểm, makeup chuyên nghiệp',
        icon: '💄',
        parentId: beautyCategory.id,
      },
    ]

    // Insert all subcategories
    for (const subcat of subcategories) {
      const created = await prisma.category.create({
        data: subcat,
      })
      console.log('  ✅ Đã tạo:', created.name)
    }

    console.log('\n🎉 Hoàn tất! Đã thêm 1 danh mục cha và 5 danh mục con.')
  } catch (error) {
    console.error('❌ Lỗi:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

addBeautyCategory()
