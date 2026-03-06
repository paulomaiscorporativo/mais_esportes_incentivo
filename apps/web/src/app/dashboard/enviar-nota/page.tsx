'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export default function EnviarNotaPage() {
    const router = useRouter();
    const [accessKey, setAccessKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await apiFetch('/invoices/submit', {
                method: 'POST',
                body: JSON.stringify({ accessKey }),
            });
            setSuccess(true);
            setAccessKey('');
            // Refresh local user data to update balance
            const userData: any = await apiFetch('/profile');
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-mais-blue p-4 text-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
                    <div className="flex items-center">
                        <button onClick={() => router.back()} className="mr-4 hover:opacity-80">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="text-xl font-bold">Enviar Nota Fiscal</h1>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto p-4 mt-12 text-center">
                <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
                    <div className="w-20 h-20 bg-mais-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 text-mais-orange">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>

                    <h2 className="text-2xl font-black text-mais-blue uppercase tracking-tight">Ganhe Mais Coins</h2>
                    <p className="text-gray-400 mt-2 font-medium italic">Aponte a câmera para o QR Code da sua NF-e ou preencha a chave de acesso.</p>

                    <div className="mt-8 space-y-6">
                        {/* Placeholder para Upload/Scan */}
                        <div className="border-4 border-dashed border-gray-100 rounded-[2.5rem] p-12 text-center group hover:border-mais-orange/20 transition-all cursor-pointer">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest leading-relaxed">Clique para escanear <br /> o QR Code da nota</p>
                        </div>

                        <div className="relative py-4 flex items-center">
                            <div className="flex-grow border-t border-gray-100"></div>
                            <span className="flex-shrink mx-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Ou digite a chave</span>
                            <div className="flex-grow border-t border-gray-100"></div>
                        </div>

                        <input
                            type="text"
                            placeholder="44 dígitos da chave de acesso"
                            value={accessKey} // Assuming accessKey is still used, based on the original state and handleSubmit
                            onChange={(e) => setAccessKey(e.target.value.replace(/\D/g, ''))} // Keep the original onChange logic
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:bg-white focus:border-mais-orange transition-all font-bold text-mais-blue placeholder:text-gray-300"
                        />

                        {error && (
                            error.includes('Mais Corporativo') || error.includes('sistema') ? (
                                <div className="mt-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-left flex items-start gap-4">
                                    <span className="text-2xl flex-shrink-0">🚫</span>
                                    <div>
                                        <p className="text-amber-800 font-black uppercase text-xs tracking-widest mb-1">Nota Fiscal Não Contabilizada</p>
                                        <p className="text-amber-700 text-sm leading-relaxed">{error}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 italic">⚠️ {error}</div>
                            )
                        )}
                        {success && <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100 flex items-center gap-2">🎉 <span>Nota enviada com sucesso! Seus <b>Mais Coins</b> foram creditados.</span></div>}

                        <button
                            onClick={handleSubmit}
                            disabled={loading || accessKey.length < 44} // Changed from invoiceKey to accessKey
                            className="w-full bg-mais-blue text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-mais-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:scale-100 disabled:shadow-none"
                        >
                            {loading ? 'Processando...' : 'Validar e Ganhar Mais Coins'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
