import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from 'mais-database';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(private prisma: PrismaService) { }

    async onModuleInit() {
        const adminEmail = 'paulocardosocampos1985@gmail.com';
        const adminPassword = 'maiscoins';

        try {
            const admin = await this.prisma.user.findFirst({ where: { role: 'ADMIN' } });

            if (admin) {
                // Keep admin updated with these credentials
                if (admin.email !== adminEmail || admin.passwordHash !== adminPassword) {
                    await this.update(admin.id, { email: adminEmail, passwordHash: adminPassword });
                    console.log('Admin credentials updated on startup.');
                }
            } else {
                await this.create({
                    email: adminEmail,
                    passwordHash: adminPassword,
                    name: 'Admin',
                    document: 'admin_123', // Dummy document for initial admin
                    role: 'ADMIN'
                });
                console.log('Admin user created on startup.');
            }
        } catch (e) {
            console.error('Failed to ensure admin user exists on startup:', e);
        }
    }

    async findOne(document: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { document },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findByResetToken(resetToken: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { resetToken },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                store: true,
                sellers: true,
            }
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany({
            include: {
                store: true,
                sellers: true,
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<User> {
        return this.prisma.user.delete({
            where: { id },
        });
    }

    async getLeaderboard() {
        return this.prisma.user.findMany({
            where: { role: { not: 'ADMIN' } },
            orderBy: { coinBalance: 'desc' },
            take: 10,
            select: {
                id: true,
                name: true,
                coinBalance: true,
                document: true
            }
        });
    }

    async getGlobalStats() {
        const [totalUsers, totalCoins, totalOrders] = await Promise.all([
            this.prisma.user.count({ where: { role: { not: 'ADMIN' } } }),
            this.prisma.user.aggregate({ _sum: { coinBalance: true } }),
            this.prisma.order.count(),
        ]);

        return {
            totalUsers,
            totalCoins: totalCoins._sum.coinBalance || 0,
            totalOrders
        };
    }

    async getInsights() {
        // Busca usuários que estão próximos (ex: 80% do caminho) de algum pacote ativo
        const users = await this.prisma.user.findMany({
            where: { role: { not: 'ADMIN' }, coinBalance: { gt: 0 } },
            select: { id: true, name: true, coinBalance: true }
        });

        const packages = await this.prisma.eventPackage.findMany({
            where: { isActive: true },
            select: { id: true, teamMatch: true, priceCoins: true }
        });

        const insights = [];

        for (const user of users) {
            for (const pkg of packages) {
                const diff = pkg.priceCoins - user.coinBalance;
                // Se falta menos de 20% do valor do pacote
                if (diff > 0 && diff <= pkg.priceCoins * 0.2) {
                    insights.push({
                        userName: user.name,
                        packageName: pkg.teamMatch,
                        coinsMissing: diff,
                        percent: Math.round((user.coinBalance / pkg.priceCoins) * 100)
                    });
                }
            }
        }

        // Retorna os top 5 insights (mais próximos de completar)
        return insights.sort((a, b) => a.coinsMissing - b.coinsMissing).slice(0, 5);
    }
}
