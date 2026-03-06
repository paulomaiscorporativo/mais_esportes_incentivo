'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function NovoPacotePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        championship: '',
        teamMatch: '',
        eventDate: '',
        priceCoins: 500,
        stock: 50,
        location: '',
        description: '',
        imageUrl: '',
        hasAirfare: false,
        hasHotel: false,
        hasTransfer: false,
        hasFood: false,
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await apiFetch('/events/cms/create', {
                method: 'POST',
                body: JSON.stringify(form),
            });
            router.push('/admin/pacotes');
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <nav className="bg-mais-blue p-4 text-white">
                <div className="max-w-4xl mx-auto flex items-center px-4">
                    <button onClick={() => router.back()} className="mr-4 hover:opacity-80">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Novo <span className="text-mais-orange font-black">Pacote de Viagem</span></h1>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto p-4 mt-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Bloco 1: Informações Básicas */}
                    <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h3 className="text-lg font-black text-mais-blue uppercase mb-6 flex items-center">
                            <span className="w-8 h-8 bg-mais-blue/10 text-mais-blue rounded-full flex items-center justify-center mr-3 text-xs italic">01</span>
                            Dados do Evento
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Título do Pacote</label>
                                <input name="title" required value={form.title} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-blue transition-all" placeholder="Ex: Super Clássico VIP em São Paulo" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Campeonato</label>
                                <input name="championship" required value={form.championship} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-blue transition-all" placeholder="Ex: Brasileirão 2026" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Confronto (Jogo)</label>
                                <input name="teamMatch" required value={form.teamMatch} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-blue transition-all" placeholder="Ex: Palmeiras vs Corinthians" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Data e Hora</label>
                                <input name="eventDate" type="datetime-local" required value={form.eventDate} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-blue transition-all" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Local / Estádio</label>
                                <input name="location" required value={form.location} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-blue transition-all" placeholder="Ex: Allianz Parque, SP" />
                            </div>
                        </div>
                    </section>

                    {/* Bloco 2: Itens Inclusos (Modularidade) */}
                    <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h3 className="text-lg font-black text-mais-blue uppercase mb-6 flex items-center">
                            <span className="w-8 h-8 bg-mais-orange/10 text-mais-orange rounded-full flex items-center justify-center mr-3 text-xs italic">02</span>
                            O que está incluso?
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { id: 'hasAirfare', label: 'Passagem Aérea', icon: '✈️' },
                                { id: 'hasHotel', label: 'Hospedagem', icon: '🏨' },
                                { id: 'hasTransfer', label: 'Translado', icon: '🚐' },
                                { id: 'hasFood', label: 'Alimentação', icon: '🍱' },
                            ].map((item) => (
                                <label key={item.id} className={`cursor-pointer group flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${form[item.id as keyof typeof form] ? 'bg-mais-orange/10 border-mais-orange' : 'bg-gray-50 border-gray-50 hover:bg-white hover:border-mais-blue/30'}`}>
                                    <input type="checkbox" name={item.id} checked={form[item.id as keyof typeof form] as boolean} onChange={handleChange} className="hidden" />
                                    <span className="text-2xl mb-2 grayscale group-hover:grayscale-0">{item.icon}</span>
                                    <span className="text-[10px] font-black text-mais-blue uppercase text-center">{item.label}</span>
                                    <div className={`mt-2 w-10 h-1.5 rounded-full transition-all ${form[item.id as keyof typeof form] ? 'bg-mais-orange' : 'bg-gray-200'}`} />
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Bloco 3: Economia */}
                    <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h3 className="text-lg font-black text-mais-blue uppercase mb-6 flex items-center">
                            <span className="w-8 h-8 bg-mais-red/10 text-mais-red rounded-full flex items-center justify-center mr-3 text-xs italic">03</span>
                            Regras e Valores
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Preço em Mais Coins</label>
                                <input name="priceCoins" type="number" required value={form.priceCoins} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-blue transition-all font-black text-xl text-mais-blue" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Estoque (Vagas)</label>
                                <input name="stock" type="number" required value={form.stock} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-blue transition-all font-black" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Descrição Adicional (Opcional)</label>
                                <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-blue transition-all" placeholder="Informações detalhadas sobre o pacote..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">URL da Imagem de Capa</label>
                                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full bg-gray-50 border-2 border-gray-50 rounded-xl px-4 py-3 focus:bg-white focus:border-mais-blue transition-all" placeholder="https://exemplo.com/foto-estadio.jpg" />
                                <p className="text-[9px] text-gray-400 mt-2 italic">* Caso em branco, usaremos uma imagem padrão esportiva.</p>
                            </div>
                        </div>
                    </section>

                    {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-bold uppercase">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-mais-blue text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-mais-blue/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest"
                    >
                        {loading ? 'Processando...' : 'Publicar no Catálogo'}
                    </button>
                </form>
            </main>
        </div>
    );
}
