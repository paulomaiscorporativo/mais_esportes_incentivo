'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [document, setDocument] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CNPJ_MASTER');
    const [storeCnpj, setStoreCnpj] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data: any = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    email,
                    document,
                    passwordHash: password,
                    role
                }),
            });

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Se for vendedor com CNPJ informado, solicita o vínculo automaticamente
            if (role === 'CPF_SELLER' && storeCnpj.trim()) {
                try {
                    await apiFetch('/links/request', {
                        method: 'POST',
                        body: JSON.stringify({ storeCnpj: storeCnpj.trim() }),
                    });
                } catch (linkErr: any) {
                    // Não impede o cadastro se o vínculo falhar
                    console.warn('Vínculo não solicitado:', linkErr.message);
                }
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-mais-blue px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-2xl">
                <div>
                    <h1 className="text-center text-3xl font-bold text-mais-blue">
                        Mais Corporativo <span className="text-mais-orange">Incentivo</span>
                    </h1>
                    <h2 className="mt-6 text-center text-xl font-semibold tracking-tight text-gray-900">
                        Crie sua conta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Preencha seus dados para começar a ganhar Mais Coins
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Tipo de Conta
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-mais-orange focus:outline-none focus:ring-mais-orange sm:text-sm"
                            >
                                <option value="CNPJ_MASTER">Dono de Loja (CNPJ)</option>
                                <option value="CPF_SELLER">Vendedor (CPF)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nome / Razão Social
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-mais-orange focus:outline-none focus:ring-mais-orange sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-mais-orange focus:outline-none focus:ring-mais-orange sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="document" className="block text-sm font-medium text-gray-700">
                                {role === 'CNPJ_MASTER' ? 'CNPJ' : 'CPF'}
                            </label>
                            <input
                                id="document"
                                type="text"
                                required
                                value={document}
                                onChange={(e) => setDocument(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-mais-orange focus:outline-none focus:ring-mais-orange sm:text-sm"
                            />
                        </div>
                        {role === 'CPF_SELLER' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                                <label htmlFor="storeCnpj" className="block text-xs font-black text-blue-600 uppercase tracking-widest">
                                    CNPJ da Empresa (opcional)
                                </label>
                                <p className="text-[11px] text-blue-400 font-medium">Informe para solicitar o vínculo com sua empresa empregadora automaticamente.</p>
                                <input
                                    id="storeCnpj"
                                    type="text"
                                    value={storeCnpj}
                                    onChange={(e) => setStoreCnpj(e.target.value)}
                                    className="block w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-gray-900 focus:border-blue-400 focus:outline-none sm:text-sm"
                                    placeholder="00.000.000/0001-00"
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-mais-orange focus:outline-none focus:ring-mais-orange sm:text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-lg bg-mais-orange px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-mais-orange focus:ring-offset-2 disabled:bg-gray-400"
                    >
                        {loading ? 'Cadastrando...' : 'Criar minha conta'}
                    </button>

                    <div className="text-center text-sm">
                        <a href="/login" className="font-medium text-mais-blue hover:text-mais-orange">
                            Já tem conta? Faça login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
