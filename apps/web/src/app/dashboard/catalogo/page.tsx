'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function CatalogoPage() {
    const router = useRouter();
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        async function loadPackages() {
            try {
                const data: any = await apiFetch('/events');
                setPackages(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadPackages();
    }, []);

    // Agrupamento por Campeonato
    const groupedByChampionship = packages.reduce((acc: any, pkg: any) => {
        if (!acc[pkg.championship]) acc[pkg.championship] = [];
        acc[pkg.championship].push(pkg);
        return acc;
    }, {});

    const championships = Object.keys(groupedByChampionship);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <nav className="bg-mais-blue p-4 text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center">
                        <button onClick={() => router.back()} className="mr-4 hover:opacity-80">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="text-xl font-bold uppercase tracking-tight italic">Catálogo de <span className="text-mais-orange font-black">Prêmios</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all hidden sm:block"
                        >
                            Voltar ao Início
                        </button>
                        {user && (
                            <div className="bg-white/10 px-4 py-1 rounded-full text-sm font-bold flex items-center border border-white/10">
                                <span className="text-mais-orange mr-2 animate-pulse">●</span>
                                {user.coinBalance} MAIS COINS
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 sm:p-8">
                <header className="mb-12 text-center sm:text-left flex flex-col sm:flex-row items-end justify-between gap-4">
                    <div>
                        <h2 className="text-5xl font-black text-mais-blue uppercase tracking-tighter leading-none">Escolha seu <span className="text-mais-orange">Destino</span></h2>
                        <p className="text-gray-400 mt-4 font-medium max-w-xl">Redima seus mais coins por experiências inesquecíveis nos maiores estádios do continente.</p>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mais-blue"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-mais-blue/40">Carregando Experiências...</p>
                    </div>
                ) : packages.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center shadow-2xl border border-gray-100 italic">
                        <p className="text-gray-400 text-lg font-bold">Nenhum evento disponível no momento.</p>
                        <button className="mt-4 text-mais-blue font-black uppercase text-xs tracking-widest hover:underline" onClick={() => router.push('/dashboard/enviar-nota')}>
                            Ganhe mais Mais Coins enquanto espera
                        </button>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {/* Seção 1: Destaques por Campeonato */}
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-mais-blue/10 flex-grow"></div>
                                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-mais-blue/40">Destaques por Campeonato</h3>
                                <div className="h-px bg-mais-blue/10 flex-grow"></div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {championships.map(name => (
                                    <div key={name} className="bg-mais-blue rounded-3xl p-6 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-mais-orange mb-2">Campeonato</p>
                                        <h4 className="text-xl font-black text-white uppercase leading-tight">{name}</h4>
                                        <p className="text-[10px] text-white/40 mt-4 font-bold uppercase">{groupedByChampionship[name].length} Experiências</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Seção 2: Jogos Agrupados */}
                        {championships.map(champ => (
                            <section key={champ}>
                                <div className="flex items-center justify-between mb-8 border-b-2 border-mais-blue/5 pb-4">
                                    <h3 className="text-3xl font-black text-mais-blue uppercase tracking-tighter">{champ}</h3>
                                    <span className="bg-mais-blue/5 px-4 py-1 rounded-full text-[10px] font-black text-mais-blue uppercase tracking-widest">
                                        Ver Todos do {champ}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {groupedByChampionship[champ].map((pkg: any) => (
                                        <div key={pkg.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all group border border-gray-100 flex flex-col group/card">
                                            <div className="h-60 bg-gray-200 relative overflow-hidden">
                                                {pkg.imageUrl ? (
                                                    <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full bg-mais-blue flex items-center justify-center text-white/10 group-hover/card:scale-110 transition-transform">
                                                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                                                    </div>
                                                )}
                                                <div className="absolute top-6 left-6">
                                                    <div className="bg-mais-orange text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                                        {pkg.championship}
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-[1.5rem] shadow-2xl border border-white">
                                                    <p className="text-[10px] text-gray-500 font-black uppercase leading-none tracking-widest text-center">Resgate</p>
                                                    <p className="text-2xl font-black text-mais-blue leading-none mt-1.5">{pkg.priceCoins} <span className="text-[10px] text-mais-orange uppercase">Mais Coins</span></p>
                                                </div>
                                            </div>

                                            <div className="p-8 flex-grow">
                                                <h3 className="text-2xl font-black text-mais-blue mb-2 uppercase leading-[0.9] group-hover/card:text-mais-orange transition-colors">{pkg.teamMatch}</h3>
                                                <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest mt-4">
                                                    <svg className="w-4 h-4 mr-2 text-mais-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    {pkg.location}
                                                </div>
                                                <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
                                                    <svg className="w-4 h-4 mr-2 text-mais-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    {new Date(pkg.eventDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </div>

                                                <div className="mt-8 grid grid-cols-3 gap-2">
                                                    {pkg.hasAirfare && <div className="bg-gray-50 text-gray-500 text-[8px] p-2 rounded-xl font-black border border-gray-100 text-center uppercase">Voo</div>}
                                                    {pkg.hasHotel && <div className="bg-gray-50 text-gray-500 text-[8px] p-2 rounded-xl font-black border border-gray-100 text-center uppercase">Hotel</div>}
                                                    {pkg.hasFood && <div className="bg-gray-50 text-gray-500 text-[8px] p-2 rounded-xl font-black border border-gray-100 text-center uppercase">Open Bar</div>}
                                                </div>

                                                <button
                                                    disabled={user?.coinBalance < pkg.priceCoins}
                                                    onClick={() => router.push(`/dashboard/redimir/${pkg.id}`)}
                                                    className="mt-8 w-full bg-mais-blue text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 hover:bg-mais-blue/90 transition-all disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none translate-z-0 group-hover/card:bg-mais-orange group-hover/card:text-mais-blue"
                                                >
                                                    {user?.coinBalance < pkg.priceCoins ? 'Mais Coins Insuficientes' : 'Resgatar Agora'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}

                        {/* Seção 3: Variedade (Todos os Jogos) */}
                        <section className="bg-mais-blue/5 rounded-[4rem] p-12">
                            <div className="text-center mb-12">
                                <h3 className="text-4xl font-black text-mais-blue uppercase leading-none tracking-tighter italic">Nossa <span className="text-mais-orange">Variedade</span></h3>
                                <p className="text-gray-500 mt-4 font-bold uppercase text-[10px] tracking-[0.3em]">Explore todas as opções disponíveis no catálogo</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {packages.map(pkg => (
                                    <div key={pkg.id} className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all cursor-pointer" onClick={() => router.push(`/dashboard/redimir/${pkg.id}`)}>
                                        <div className="w-12 h-12 bg-mais-blue/5 rounded-full flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-mais-blue/30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                                        </div>
                                        <p className="text-[8px] font-black text-mais-orange uppercase mb-1">{pkg.championship}</p>
                                        <h5 className="text-[10px] font-black text-mais-blue uppercase leading-tight line-clamp-1">{pkg.teamMatch}</h5>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}
