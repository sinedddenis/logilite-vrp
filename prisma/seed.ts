import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearAll() {
    await prisma.stop.deleteMany({})
    await prisma.route.deleteMany({})
    await prisma.vehicle.deleteMany({})
    await prisma.driver.deleteMany({})
    await prisma.customer.deleteMany({})
}

async function main() {
    console.log('Seeding (skeleton)…')
    await clearAll()
    const [customers, drivers, vehicles, routes, stops] = await Promise.all([
        prisma.customer.count(),
        prisma.driver.count(),
        prisma.vehicle.count(),
        prisma.route.count(),
        prisma.stop.count()
    ])
    console.log('Seed skeleton finished.')
    console.table({ customers, drivers, vehicles, routes, stops })
}

main()
    .catch((e) => {
        console.error('Seed failed:', e)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
