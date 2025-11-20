const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addPlantCategory() {
  try {
    // Find the parent category "Đồ gia dụng"
    const parentCategory = await prisma.category.findUnique({
      where: { slug: 'do-gia-dung' }
    });

    if (!parentCategory) {
      console.error('❌ Không tìm thấy danh mục cha "Đồ gia dụng"');
      return;
    }

    console.log(`✅ Tìm thấy danh mục cha: ${parentCategory.name} (ID: ${parentCategory.id})`);

    // Check if "Cây kiểng" already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: 'cay-kieng' }
    });

    if (existingCategory) {
      console.log('⚠️  Danh mục "Cây kiểng" đã tồn tại!');
      return;
    }

    // Create the new category
    const newCategory = await prisma.category.create({
      data: {
        name: 'Cây kiểng',
        slug: 'cay-kieng',
        description: 'Cây cảnh, cây để bàn, cây trang trí nội thất',
        icon: '🪴',
        parentId: parentCategory.id,
      }
    });

    console.log('\n🎉 Đã thêm danh mục mới:');
    console.log(`   Tên: ${newCategory.name}`);
    console.log(`   Slug: ${newCategory.slug}`);
    console.log(`   Icon: ${newCategory.icon}`);
    console.log(`   Mô tả: ${newCategory.description}`);
    console.log(`   Danh mục cha: ${parentCategory.name}`);

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addPlantCategory();
