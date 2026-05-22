const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const reports = await prisma.pengaduan.findMany();
  console.log("TOTAL REPORTS:", reports.length);
  console.log(JSON.stringify(reports.slice(0, 5), null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
