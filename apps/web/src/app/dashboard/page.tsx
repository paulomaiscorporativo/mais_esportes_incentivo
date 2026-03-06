'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(true);

    // Admin States
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [insights, setInsights] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loadingAdmin, setLoadingAdmin] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        async function loadData() {
            try {
                // Busca saldo atualizado do banco (evita usar o cache do localStorage)
                const freshProfile: any = await apiFetch('/profile');
                if (freshProfile) {
                    setUser((prev: any) => ({ ...prev, coinBalance: freshProfile.coinBalance, name: freshProfile.name }));
                }

                // Carregar sugestões (comum a todos)
                const events: any = await apiFetch('/events');
                setSuggestions(events.slice(0, 4));

                // Carregar dados de Admin se necessário
                if (parsedUser.role === 'ADMIN') {
                    setLoadingAdmin(true);
                    const [lb, inst, st] = await Promise.all([
                        apiFetch('/profile/cms/stats/leaderboard'),
                        apiFetch('/profile/cms/stats/insights'),
                        apiFetch('/profile/cms/stats/global')
                    ]);
                    setLeaderboard(lb as any[]);
                    setInsights(inst as any[]);
                    setStats(st);
                    setLoadingAdmin(false);
                }
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
            } finally {
                setLoadingSuggestions(false);
            }
        }
        loadData();
    }, [router]);

    if (!user) return <div className="flex items-center justify-center min-h-screen font-black text-mais-blue uppercase tracking-widest animate-pulse">Carregando...</div>;

    const isAdmin = user.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-mais-blue/5 pb-20">
            <nav className="bg-mais-blue p-4 text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                    <h1 className="text-xl font-bold italic tracking-tighter uppercase">Mais Corporativo <span className="text-mais-orange">Incentivo</span></h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-black uppercase tracking-widest border-r border-white/20 pr-4 mr-4 hidden sm:inline text-white/60">{user.name}</span>
                        {isAdmin && (
                            <button
                                onClick={() => router.push('/admin/pacotes')}
                                className="text-[10px] bg-mais-orange text-mais-blue font-black px-4 py-1.5 rounded-full hover:scale-105 transition-all uppercase tracking-widest shadow-lg shadow-mais-orange/20"
                            >
                                Painel Admin
                            </button>
                        )}
                        {!isAdmin && (
                            <button
                                onClick={() => router.push('/dashboard/resgates')}
                                className="text-[10px] font-black opacity-60 hover:opacity-100 transition-all uppercase tracking-widest px-4 border-r border-white/20"
                            >
                                Meus Resgates
                            </button>
                        )}
                        {user.role === 'CNPJ_MASTER' && (
                            <button
                                onClick={() => router.push('/dashboard/equipe')}
                                className="text-[10px] font-black opacity-60 hover:opacity-100 transition-all uppercase tracking-widest px-4 border-r border-white/20"
                            >
                                Equipe
                            </button>
                        )}
                        {user.role === 'CPF_SELLER' && (
                            <button
                                onClick={() => router.push('/dashboard/minha-empresa')}
                                className="text-[10px] font-black opacity-60 hover:opacity-100 transition-all uppercase tracking-widest px-4 border-r border-white/20"
                            >
                                Minha Empresa
                            </button>
                        )}
                        <button
                            onClick={() => {
                                const role = user?.role;
                                localStorage.clear();
                                router.push(role === 'ADMIN' ? '/admin/login' : '/login');
                            }}
                            className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-all"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 sm:p-8">
                <header className="mb-12">
                    <div className="flex items-center gap-3">
                        <h2 className="text-5xl font-black text-mais-blue uppercase tracking-tighter">Olá, {user.name.split(' ')[0]}!</h2>
                        {isAdmin && <span className="bg-mais-blue text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mt-2">Admin</span>}
                    </div>
                    <p className="text-gray-400 mt-3 font-medium text-lg italic">
                        {isAdmin ? 'Veja o desempenho global da plataforma Mais Esportes Incentivo.' : 'Veja como estão seus Mais Coins hoje.'}
                    </p>
                </header>

                {isAdmin ? (
                    /* Dashboard Administrador */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card Leaderboard */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <svg className="w-24 h-24 text-mais-blue" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg>
                            </div>
                            <span className="bg-mais-blue/5 text-mais-blue text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Ranking dos Top Users</span>
                            <div className="mt-8 space-y-4">
                                {leaderboard.slice(0, 5).map((u, i) => (
                                    <div key={u.id} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-2xl hover:bg-mais-blue/5 transition-all">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i === 0 ? 'bg-mais-red text-mais-blue' : 'bg-gray-200 text-gray-400'}`}>
                                                {i + 1}
                                            </span>
                                            <p className="text-xs font-bold text-mais-blue uppercase">{u.name}</p>
                                        </div>
                                        <p className="text-xs font-black text-mais-orange">{u.coinBalance} <span className="text-[10px]">Mais Coins</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card Insights */}
                        <div className="bg-mais-blue rounded-[2.5rem] p-10 shadow-2xl text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" /></svg>
                            </div>
                            <span className="bg-mais-orange text-mais-blue text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Insights Estratégicos</span>
                            <h3 className="text-xl font-black mt-6 uppercase leading-tight italic">Usuários próximos <br /> do resgate</h3>
                            <div className="mt-8 space-y-5">
                                {insights.length > 0 ? insights.map((insight, i) => (
                                    <div key={i} className="border-l-2 border-mais-orange/30 pl-4 py-1">
                                        <p className="text-[10px] font-black text-mais-orange uppercase tracking-widest">{insight.userName}</p>
                                        <p className="text-xs text-white/60 font-medium">Apenas {insight.coinsMissing} mais coins da {insight.packageName}</p>
                                        <div className="w-full bg-white/10 h-1 rounded-full mt-2">
                                            <div className="bg-mais-orange h-1 rounded-full" style={{ width: `${insight.percent}%` }}></div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-xs text-white/40 italic">Nenhum insight disponível no momento.</p>
                                )}
                            </div>
                        </div>

                        {/* Card Global Stats */}
                        <div className="bg-white border-4 border-mais-blue rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                            <div>
                                <span className="bg-mais-blue text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Status do Programa</span>
                                <div className="mt-10 grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Mais Coins</p>
                                        <p className="text-3xl font-black text-mais-blue tracking-tighter mt-1">{stats?.totalCoins || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Participantes</p>
                                        <p className="text-3xl font-black text-mais-blue tracking-tighter mt-1">{stats?.totalUsers || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resgates</p>
                                        <p className="text-3xl font-black text-mais-blue tracking-tighter mt-1">{stats?.totalOrders || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => router.push('/admin/pacotes')} className="mt-12 w-full bg-mais-orange text-mais-blue py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-lg shadow-mais-orange/20">
                                Gerenciar Catálogo
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Dashboard Participante */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card de Saldo */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border-l-[12px] border-mais-orange">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <svg className="w-24 h-24 text-mais-blue" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" /></svg>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mais Coins</p>
                            <div className="mt-6 flex items-baseline space-x-3">
                                <span className="text-7xl font-black text-mais-blue tracking-tighter leading-none">{user.coinBalance}</span>
                                <span className="text-mais-orange font-black text-sm uppercase tracking-widest animate-pulse">Saldo</span>
                            </div>
                            <div className="mt-10 flex gap-3">
                                <a href="/dashboard/extrato" className="flex-1 bg-mais-blue text-center text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-opacity-90 transition-all text-[10px] shadow-lg">
                                    Ver Extrato
                                </a>
                                <a href="/dashboard/resgates" className="flex-1 bg-gray-100 text-center text-mais-blue py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all text-[10px]">
                                    Meus Resgates
                                </a>
                            </div>
                        </div>

                        {/* Atalho NFC */}
                        <div className="bg-mais-blue rounded-[2.5rem] p-10 shadow-2xl text-white flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" /></svg>
                            </div>
                            <div>
                                <span className="bg-mais-orange text-mais-blue text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Acelere seu saldo</span>
                                <h3 className="text-3xl font-black mt-6 uppercase leading-none italic">Enviar Nota <br /> Fiscal</h3>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-4">Transforme suas compras em experiências esportivas.</p>
                            </div>
                            <a href="/dashboard/enviar-nota" className="mt-10 block w-full bg-mais-orange text-center text-mais-blue py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-lg shadow-mais-orange/20">
                                Enviar Agora
                            </a>
                        </div>

                        {/* Próximo Resgate (Simulado baseado no catalogo) */}
                        <div className="bg-mais-red rounded-[2.5rem] p-10 shadow-2xl text-mais-blue flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                <svg className="w-24 h-24 text-mais-blue" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                            </div>
                            <div>
                                <span className="bg-mais-blue/10 text-mais-blue text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Mais Desejado</span>
                                <h3 className="text-3xl font-black mt-6 uppercase leading-none italic">Final da <br /> Libertadores</h3>
                                <p className="text-mais-blue/50 text-[10px] font-bold uppercase tracking-widest mt-4">Faltam apenas 450 mais coins para este resgate!</p>
                            </div>
                            <div className="mt-10">
                                <div className="w-full bg-mais-blue/10 h-3 rounded-full overflow-hidden">
                                    <div className="bg-mais-blue h-full rounded-full animate-pulse" style={{ width: '70%' }}></div>
                                </div>
                                <p className="text-[10px] font-black uppercase text-mais-blue/40 mt-3 tracking-widest">70% do caminho concluído</p>
                            </div>
                        </div>
                    </div>
                )}

                <section className="mt-20">
                    <div className="flex justify-between items-end mb-8 border-b-2 border-mais-blue/5 pb-6">
                        <div>
                            <h3 className="text-4xl font-black text-mais-blue uppercase tracking-tighter italic">Vitrine de <span className="text-mais-orange">Experiências</span></h3>
                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Escolha seu próximo destino nos esportes</p>
                        </div>
                        <a href="/dashboard/catalogo" className="text-[10px] font-black text-mais-orange hover:underline uppercase tracking-[0.2em] border-2 border-mais-orange/20 px-6 py-2 rounded-full hover:bg-mais-orange/5 transition-all">Ver Catálogo Completo</a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loadingSuggestions ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-[2.5rem] h-64 animate-pulse shadow-xl border border-gray-100"></div>
                            ))
                        ) : suggestions.length > 0 ? (
                            suggestions.map((pkg) => (
                                <div key={pkg.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg group hover:shadow-2xl transition-all border border-gray-100 flex flex-col cursor-pointer" onClick={() => router.push('/dashboard/catalogo')}>
                                    <div className="h-40 bg-gray-200 relative overflow-hidden">
                                        {pkg.imageUrl ? (
                                            <img src={pkg.imageUrl} alt={pkg.teamMatch} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full bg-mais-blue/5 flex items-center justify-center text-mais-blue/10 group-hover:scale-110 transition-transform">
                                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-mais-orange text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                                {pkg.championship}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-grow">
                                        <h4 className="font-black text-mais-blue text-sm leading-tight uppercase group-hover:text-mais-orange transition-colors">{pkg.teamMatch}</h4>
                                        <div className="flex items-center text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                                            <svg className="w-3 h-3 mr-1 text-mais-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {pkg.location}
                                        </div>
                                        <div className="mt-6 flex justify-between items-center bg-gray-50/80 p-3 rounded-xl">
                                            <span className="font-black text-mais-blue text-[10px] uppercase">
                                                {pkg.priceCoins} <span className="text-mais-orange">MAIS COINS</span>
                                            </span>
                                            <div className="bg-mais-blue/5 p-1.5 rounded-lg group-hover:bg-mais-orange/20 transition-all">
                                                <svg className="w-4 h-4 text-mais-blue group-hover:text-mais-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full bg-white rounded-[2.5rem] p-12 text-center text-gray-400 text-sm border-2 border-dashed border-gray-100 font-bold uppercase tracking-widest italic">
                                Nenhum prêmio disponível no momento.
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
