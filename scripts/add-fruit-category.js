const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addFruitCategory() {
  try {
    console.log('🍎 Đang thêm danh mục Trái cây...')

    // Check if "Đồ ăn, đồ uống" category exists
    let foodCategory = await prisma.category.findFirst({
      where: { slug: 'do-an-do-uong' }
    })

    // If not, create it
    if (!foodCategory) {
      foodCategory = await prisma.category.create({
        data: {
          name: 'Đồ ăn, đồ uống',
          slug: 'do-an-do-uong',
          description: 'Thực phẩm, đồ ăn, đồ uống',
          icon: '🍜',
        },
      })
      console.log('✅ Đã tạo danh mục cha: Đồ ăn, đồ uống')
    } else {
      console.log('✅ Đã tồn tại danh mục: Đồ ăn, đồ uống')
    }

    // Check if "Trái cây" already exists
    const existingFruit = await prisma.category.findFirst({
      where: { slug: 'trai-cay' }
    })

    if (existingFruit) {
      console.log('⏭️  Danh mục "Trái cây" đã tồn tại!')
      return
    }

    // Create "Trái cây" subcategory
    const fruitCategory = await prisma.category.create({
      data: {
        name: 'Trái cây',
        slug: 'trai-cay',
        description: 'Trái cây tươi, trái cây sạch, trái cây nhập khẩu',
        icon: '🍎',
        parentId: foodCategory.id,
      },
    })

    console.log('✅ Đã tạo:', fruitCategory.name)

    console.log('\n🎉 Hoàn tất! Danh mục "Trái cây" đã được thêm vào.')
  } catch (error) {
    console.error('❌ Lỗi:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

addFruitCategory()
