const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const patent_1 = await prisma.patents.create({data: {name: "Patent 1"}})
    const patent_2 = await prisma.patents.create({data: {name: "Patent 2"}})
    console.log({patent_1, patent_2})
}

main()
.then(async () => {prisma.$disconnect()})
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})