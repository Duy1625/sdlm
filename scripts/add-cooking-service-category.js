const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addCookingServiceCategory() {
  try {
    console.log('👨‍🍳 Đang thêm danh mục Dịch vụ nấu ăn...')

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

    // Check if "Dịch vụ nấu ăn" already exists
    const existingCooking = await prisma.category.findFirst({
      where: { slug: 'dich-vu-nau-an' }
    })

    if (existingCooking) {
      console.log('⏭️  Danh mục "Dịch vụ nấu ăn" đã tồn tại!')
      return
    }

    // Create "Dịch vụ nấu ăn" subcategory
    const cookingCategory = await prisma.category.create({
      data: {
        name: 'Dịch vụ nấu ăn',
        slug: 'dich-vu-nau-an',
        description: 'Dịch vụ nấu ăn tại nhà, tiệc, sự kiện',
        icon: '👨‍🍳',
        parentId: serviceCategory.id,
      },
    })

    console.log('✅ Đã tạo:', cookingCategory.name)

    console.log('\n🎉 Hoàn tất! Danh mục "Dịch vụ nấu ăn" đã được thêm vào.')
  } catch (error) {
    console.error('❌ Lỗi:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

addCookingServiceCategory()
