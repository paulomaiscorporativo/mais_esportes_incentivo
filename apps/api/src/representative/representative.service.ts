import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@mais-corporativo/database';

@Injectable()
export class RepresentativeService {
    constructor(private prisma: PrismaService) { }

    async getDashboard(repId: string) {
        // 1. Get all stores associated with this representative
        const stores = await this.prisma.user.findMany({
            where: { representativeId: repId, role: 'CNPJ_MASTER' },
            include: {
                sellers: {
                    select: {
                        id: true,
                        coinBalance: true,
                    }
                },
                invoices: {
                    select: {
                        coinsIssued: true,
                    }
                }
            }
        });

        // 2. Aggregate metrics
        const totalStores = stores.length;
        let totalSellers = 0;
        let totalCoinsGenerated = 0;
        let totalBalanceInNetwork = 0;

        stores.forEach(store => {
            totalSellers += store.sellers.length;
            totalBalanceInNetwork += store.coinBalance;
            store.sellers.forEach(s => totalBalanceInNetwork += s.coinBalance);
            store.invoices.forEach(i => totalCoinsGenerated += i.coinsIssued);
        });

        return {
            metrics: {
                totalStores,
                totalSellers,
                totalCoinsGenerated,
                totalBalanceInNetwork,
            },
            stores: stores.map(s => ({
                id: s.id,
                name: s.name,
                document: s.document,
                balance: s.coinBalance,
                sellersCount: s.sellers.length,
            }))
        };
    }

    async getStoreDetail(repId: string, storeId: string): Promise<User> {
        const store = await this.prisma.user.findFirst({
            where: { id: storeId, representativeId: repId },
            include: {
                sellers: true,
                invoices: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!store) throw new ForbiddenException('Loja não encontrada ou não vinculada a este representante');

        return store;
    }
}
