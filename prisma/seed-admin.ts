import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

async function main() {
  // Hash the password
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@wedosa.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Admin user created:', admin)
  console.log('Username: admin')
  console.log('Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
