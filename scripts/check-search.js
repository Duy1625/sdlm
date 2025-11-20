const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSearch() {
  console.log('=== Kiểm tra tìm kiếm ===\n');

  const searchTerm = 'rau';

  // Tìm kiếm như code hiện tại
  const results = await prisma.listing.findMany({
    where: {
      status: 'ACTIVE',
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { location: { contains: searchTerm, mode: 'insensitive' } },
        { contactName: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      contactName: true,
    },
  });

  console.log(`Tìm thấy ${results.length} bài đăng với từ khóa "${searchTerm}":\n`);
  results.forEach((listing) => {
    console.log(`ID: ${listing.id}`);
    console.log(`Title: ${listing.title}`);
    console.log(`Contact: ${listing.contactName}`);
    console.log(`Status: ${listing.status}`);
    console.log(`Description: ${listing.description.substring(0, 100)}...`);
    console.log('---\n');
  });

  // Kiểm tra tất cả bài đăng có chữ "câu"
  const allWithCau = await prisma.listing.findMany({
    where: {
      OR: [
        { title: { contains: 'câu', mode: 'insensitive' } },
        { description: { contains: 'câu', mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      title: true,
      status: true,
      description: true,
    },
  });

  console.log(`\n=== Tất cả bài đăng có chữ "câu" (${allWithCau.length}) ===\n`);
  allWithCau.forEach((listing) => {
    console.log(`ID: ${listing.id}`);
    console.log(`Title: ${listing.title}`);
    console.log(`Status: ${listing.status}`);
    console.log(`Description: ${listing.description.substring(0, 100)}...`);
    console.log('---\n');
  });

  await prisma.$disconnect();
}

checkSearch().catch(console.error);
