import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding categories...')

  const categories = [
    {
      name: 'Điện tử',
      slug: 'dien-tu',
      icon: '📱',
      description: 'Điện thoại, máy tính, thiết bị điện tử',
      children: [
        { name: 'Điện thoại', slug: 'dien-thoai', icon: '📱' },
        { name: 'Máy tính & Laptop', slug: 'may-tinh-laptop', icon: '💻' },
        { name: 'Máy tính bảng', slug: 'may-tinh-bang', icon: '📱' },
        { name: 'Âm thanh & Phụ kiện', slug: 'am-thanh-phu-kien', icon: '🎧' },
      ]
    },
    {
      name: 'Bất động sản',
      slug: 'bat-dong-san',
      icon: '🏠',
      description: 'Nhà đất, căn hộ cho thuê hoặc bán',
      children: [
        { name: 'Nhà đất bán', slug: 'nha-dat-ban', icon: '🏡' },
        { name: 'Nhà đất cho thuê', slug: 'nha-dat-cho-thue', icon: '🏠' },
        { name: 'Căn hộ chung cư', slug: 'can-ho-chung-cu', icon: '🏢' },
        { name: 'Văn phòng, Mặt bằng', slug: 'van-phong-mat-bang', icon: '🏪' },
      ]
    },
    {
      name: 'Xe cộ',
      slug: 'xe-co',
      icon: '🚗',
      description: 'Ô tô, xe máy, xe đạp',
      children: [
        { name: 'Ô tô', slug: 'o-to', icon: '🚗' },
        { name: 'Xe máy', slug: 'xe-may', icon: '🏍️' },
        { name: 'Xe đạp', slug: 'xe-dap', icon: '🚲' },
        { name: 'Phụ tùng xe', slug: 'phu-tung-xe', icon: '🔧' },
      ]
    },
    {
      name: 'Đồ gia dụng',
      slug: 'do-gia-dung',
      icon: '🏡',
      description: 'Nội thất, đồ dùng gia đình',
      children: [
        { name: 'Nội thất', slug: 'noi-that', icon: '🛋️' },
        { name: 'Đồ điện gia dụng', slug: 'do-dien-gia-dung', icon: '🔌' },
        { name: 'Bếp & Phòng ăn', slug: 'bep-phong-an', icon: '🍽️' },
        { name: 'Trang trí nhà cửa', slug: 'trang-tri-nha-cua', icon: '🖼️' },
      ]
    },
    {
      name: 'Thời trang',
      slug: 'thoi-trang',
      icon: '👕',
      description: 'Quần áo, giày dép, phụ kiện',
      children: [
        { name: 'Quần áo nam', slug: 'quan-ao-nam', icon: '👔' },
        { name: 'Quần áo nữ', slug: 'quan-ao-nu', icon: '👗' },
        { name: 'Giày dép', slug: 'giay-dep', icon: '👟' },
        { name: 'Túi xách & Phụ kiện', slug: 'tui-xach-phu-kien', icon: '👜' },
      ]
    },
    {
      name: 'Mẹ và bé',
      slug: 'me-va-be',
      icon: '👶',
      description: 'Đồ dùng cho mẹ và bé',
      children: [
        { name: 'Đồ chơi trẻ em', slug: 'do-choi-tre-em', icon: '🧸' },
        { name: 'Quần áo trẻ em', slug: 'quan-ao-tre-em', icon: '👶' },
        { name: 'Đồ dùng cho bé', slug: 'do-dung-cho-be', icon: '🍼' },
        { name: 'Đồ dùng cho mẹ', slug: 'do-dung-cho-me', icon: '🤱' },
      ]
    },
    {
      name: 'Thể thao & Giải trí',
      slug: 'the-thao-giai-tri',
      icon: '⚽',
      description: 'Đồ thể thao, sách, nhạc cụ',
      children: [
        { name: 'Dụng cụ thể thao', slug: 'dung-cu-the-thao', icon: '🏋️' },
        { name: 'Sách & Văn phòng phẩm', slug: 'sach-van-phong-pham', icon: '📚' },
        { name: 'Nhạc cụ', slug: 'nhac-cu', icon: '🎸' },
        { name: 'Đồ sưu tầm', slug: 'do-suu-tam', icon: '🎨' },
      ]
    },
    {
      name: 'Thú cưng',
      slug: 'thu-cung',
      icon: '🐶',
      description: 'Thú cưng và đồ dùng',
      children: [
        { name: 'Chó', slug: 'cho', icon: '🐕' },
        { name: 'Mèo', slug: 'meo', icon: '🐈' },
        { name: 'Chim & Cá', slug: 'chim-ca', icon: '🐦' },
        { name: 'Phụ kiện thú cưng', slug: 'phu-kien-thu-cung', icon: '🦴' },
      ]
    },
    {
      name: 'Việc làm',
      slug: 'viec-lam',
      icon: '💼',
      description: 'Tuyển dụng, tìm việc làm',
      children: [
        { name: 'Toàn thời gian', slug: 'toan-thoi-gian', icon: '🕐' },
        { name: 'Bán thời gian', slug: 'ban-thoi-gian', icon: '⏰' },
        { name: 'Freelance', slug: 'freelance', icon: '💻' },
        { name: 'Thực tập', slug: 'thuc-tap', icon: '🎓' },
      ]
    },
    {
      name: 'Dịch vụ',
      slug: 'dich-vu',
      icon: '🛠️',
      description: 'Các loại dịch vụ',
      children: [
        { name: 'Sửa chữa', slug: 'sua-chua', icon: '🔧' },
        { name: 'Vận chuyển', slug: 'van-chuyen', icon: '🚚' },
        { name: 'Dọn dẹp', slug: 'don-dep', icon: '🧹' },
        { name: 'Giáo dục & Đào tạo', slug: 'giao-duc-dao-tao', icon: '📖' },
      ]
    },
    {
      name: 'Đồ ăn, đồ uống',
      slug: 'do-an-do-uong',
      icon: '🍔',
      description: 'Thực phẩm, đồ ăn, đồ uống',
      children: [
        { name: 'Đồ ăn tươi sống', slug: 'do-an-tuoi-song', icon: '🥗' },
        { name: 'Đồ ăn chế biến', slug: 'do-an-che-bien', icon: '🍱' },
        { name: 'Đồ uống', slug: 'do-uong', icon: '🥤' },
        { name: 'Bánh kẹo', slug: 'banh-keo', icon: '🍰' },
      ]
    },
    {
      name: 'Khác',
      slug: 'khac',
      icon: '📦',
      description: 'Các sản phẩm và dịch vụ khác',
      children: [
        { name: 'Đồ cũ', slug: 'do-cu', icon: '♻️' },
        { name: 'Đồ handmade', slug: 'do-handmade', icon: '✂️' },
        { name: 'Trao đổi', slug: 'trao-doi', icon: '🔄' },
        { name: 'Cho tặng miễn phí', slug: 'cho-tang-mien-phi', icon: '🎁' },
      ]
    },
  ]

  for (const category of categories) {
    const { children, ...parentData } = category

    // Create parent category
    const parent = await prisma.category.upsert({
      where: { slug: parentData.slug },
      update: parentData,
      create: parentData,
    })

    console.log(`✅ Created parent category: ${parent.name}`)

    // Create child categories
    if (children) {
      for (const child of children) {
        const childCategory = await prisma.category.upsert({
          where: { slug: child.slug },
          update: { ...child, parentId: parent.id },
          create: { ...child, parentId: parent.id },
        })
        console.log(`  ✅ Created child category: ${childCategory.name}`)
      }
    }
  }

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
