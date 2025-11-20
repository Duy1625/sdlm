const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
  console.log('=== Danh sách danh mục hiện tại ===\n');

  const categories = await prisma.category.findMany({
    include: {
      parent: true,
      children: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Group by parent
  const parentCategories = categories.filter(c => !c.parentId);
  const childCategories = categories.filter(c => c.parentId);

  console.log('📁 Danh mục cha:\n');
  parentCategories.forEach(cat => {
    console.log(`  - ${cat.name} (slug: ${cat.slug})`);
    const children = childCategories.filter(c => c.parentId === cat.id);
    if (children.length > 0) {
      children.forEach(child => {
        console.log(`    └─ ${child.name} (slug: ${child.slug})`);
      });
    }
  });

  console.log(`\n📊 Tổng: ${parentCategories.length} danh mục cha, ${childCategories.length} danh mục con`);

  await prisma.$disconnect();
}

checkCategories().catch(console.error);
