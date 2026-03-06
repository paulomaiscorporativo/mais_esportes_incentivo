const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:postgres@localhost:5432/votorantim_futebol?schema=public"
        }
    }
});

async function main() {
    try {
        console.log("Tentando findUnique(document)...");
        const user = await prisma.user.findUnique({
            where: { document: "70.200.484/0001-06" }
        });
        console.log("FindUnique concluído (pode ser null se não existir):", user);

    } catch (e) {
        console.error("Erro capturado no findUnique:");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
