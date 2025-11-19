import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking database state...\n')

  // Check categories
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: 'asc' },
  })

  console.log(`📂 Found ${categories.length} parent categories:`)
  categories.forEach(cat => {
    console.log(`  - ${cat.name} (slug: ${cat.slug}, id: ${cat.id})`)
  })

  // Check listings
  const listings = await prisma.listing.findMany({
    where: { status: 'ACTIVE' },
    include: {
      category: true,
    },
    take: 10,
  })

  console.log(`\n📝 Found ${listings.length} active listings (showing first 10):`)
  listings.forEach(listing => {
    console.log(`  - ${listing.title}`)
    console.log(`    Category: ${listing.category.name} (slug: ${listing.category.slug}, id: ${listing.categoryId})`)
    console.log(`    Category parent ID: ${listing.category.parentId}`)
  })

  // Test the OLD query with category filter
  console.log(`\n🧪 Testing OLD category filter for 'do-an-do-uong':`)
  const oldTestListings = await prisma.listing.findMany({
    where: {
      status: 'ACTIVE',
      category: {
        slug: 'do-an-do-uong',
      },
    },
    include: {
      category: true,
    },
  })
  console.log(`  Found ${oldTestListings.length} listings`)

  // Test the NEW query with category filter (including child categories)
  console.log(`\n🧪 Testing NEW category filter for 'do-an-do-uong' (with children):`)
  const newTestListings = await prisma.listing.findMany({
    where: {
      status: 'ACTIVE',
      AND: [
        {
          OR: [
            {
              category: {
                slug: 'do-an-do-uong',
              },
            },
            {
              category: {
                parent: {
                  slug: 'do-an-do-uong',
                },
              },
            },
          ],
        },
      ],
    },
    include: {
      category: {
        include: {
          parent: true,
        },
      },
    },
  })
  console.log(`  Found ${newTestListings.length} listings`)
  newTestListings.slice(0, 5).forEach(listing => {
    console.log(`    - ${listing.title}`)
    console.log(`      Category: ${listing.category.name} (slug: ${listing.category.slug})`)
    if (listing.category.parent) {
      console.log(`      Parent: ${listing.category.parent.name} (slug: ${listing.category.parent.slug})`)
    }
  })

  // Count listings by category
  console.log(`\n📊 Listings count by category:`)
  const allCategories = await prisma.category.findMany({
    include: {
      _count: {
        select: { listings: true }
      }
    },
    orderBy: { name: 'asc' },
  })

  allCategories.forEach(cat => {
    if (cat._count.listings > 0) {
      console.log(`  - ${cat.name} (slug: ${cat.slug}): ${cat._count.listings} listings`)
    }
  })
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
