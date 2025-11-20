const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addDryFoodCategory() {
  try {
    // Find the parent category "Đồ ăn, đồ uống"
    const parentCategory = await prisma.category.findUnique({
      where: { slug: 'do-an-do-uong' }
    });

    if (!parentCategory) {
      console.error('❌ Không tìm thấy danh mục cha "Đồ ăn, đồ uống"');
      return;
    }

    console.log(`✅ Tìm thấy danh mục cha: ${parentCategory.name} (ID: ${parentCategory.id})`);

    // Check if "Thực phẩm khô" already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: 'thuc-pham-kho' }
    });

    if (existingCategory) {
      console.log('⚠️  Danh mục "Thực phẩm khô" đã tồn tại!');
      return;
    }

    // Create the new category
    const newCategory = await prisma.category.create({
      data: {
        name: 'Thực phẩm khô',
        slug: 'thuc-pham-kho',
        description: 'Gạo, bột mì, đậu, mì khô và các thực phẩm khô khác',
        icon: '🌾',
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

addDryFoodCategory();
