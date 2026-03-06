/**
 * Seed: Emissores Autorizados do Grupo Mais Corporativo
 *
 * Execute com:
 *   npx ts-node prisma/seed-emitters.ts
 *
 * Este script popula a tabela AllowedEmitter com os CNPJs iniciais do grupo.
 * Novos CNPJs podem ser adicionados via painel Admin sem precisar rodar o seed novamente.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EMITTERS = [
    { cnpj: '01637895000132', name: 'Mais Corporativo S.A. — Matriz/SP' },
    { cnpj: '01637895002186', name: 'VOTORAN' },
    { cnpj: '01637895000566', name: 'Mais Corporativo S.A. — Filial/SP' },
    { cnpj: '10656452000180', name: 'Mais Corporativo N/NE S/A — Recife/PE' },
    { cnpj: '01637895018422', name: 'Mais Corporativo S.A. — Filial/MT' },
    { cnpj: '01637895010600', name: 'Mais Corporativo S.A. — Filial/PR' },
];

async function main() {
    console.log('🌱 Populando emissores autorizados...');
    for (const emitter of EMITTERS) {
        await prisma.allowedEmitter.upsert({
            where: { cnpj: emitter.cnpj },
            update: { name: emitter.name, active: true },
            create: { cnpj: emitter.cnpj, name: emitter.name },
        });
        console.log(`  ✅ ${emitter.name} (${emitter.cnpj})`);
    }
    console.log(`\n✅ ${EMITTERS.length} emissores cadastrados com sucesso!`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
