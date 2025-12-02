const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src/app/(public)/listings/[slug]/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update metadata section
const oldReturn = `  return {
    title: listing.title,
    description: \`\${description} - Giá: \${priceText}. \${listing.category.name} tại \${listing.location || 'Sa Đéc'}\`,
    keywords: [
      listing.title,
      listing.category.name,
      'mua bán ' + listing.category.name.toLowerCase(),
      listing.location || 'sa đéc',
      'chợ rao vặt',
      'đồng tháp',
      ...listing.title.split(' ').filter(word => word.length > 3)
    ],
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      url: \`https://sdlm.vercel.app/listings/\${listing.slug}\`,
      siteName: 'Sadec Local Market',
      title: listing.title,
      description: \`\${description} - Giá: \${priceText}\`,`;

const newReturn = `  const location = listing.location || 'Sa Đéc'
  
  return {
    title: \`\${listing.title} - \${location}\`,
    description: \`\${description} - Giá: \${priceText}. \${listing.category.name} tại \${location}, Đồng Tháp. Mua bán uy tín trên SDLM.\`,
    keywords: [
      listing.title,
      listing.title + ' ' + location.toLowerCase(),
      listing.category.name,
      listing.category.name + ' ' + location.toLowerCase(),
      'mua bán ' + listing.category.name.toLowerCase() + ' ' + location.toLowerCase(),
      location.toLowerCase(),
      'sa đéc',
      'đồng tháp', 
      'chợ rao vặt ' + location.toLowerCase(),
      'sdlm',
      ...listing.title.split(' ').filter(word => word.length > 3)
    ],
    alternates: {
      canonical: \`https://sdlm.vercel.app/listings/\${listing.slug}\`,
    },
    openGraph: {
      type: 'product',
      locale: 'vi_VN',
      url: \`https://sdlm.vercel.app/listings/\${listing.slug}\`,
      siteName: 'SDLM - Chợ Rao Vặt Sa Đéc',
      title: \`\${listing.title} - \${location}\`,
      description: \`\${description} - Giá: \${priceText} tại \${location}\`,`;

if (content.includes(oldReturn)) {
  content = content.replace(oldReturn, newReturn);
  fs.writeFileSync(filePath, content);
  console.log('Metadata updated successfully');
} else {
  console.log('Metadata pattern not found');
}
