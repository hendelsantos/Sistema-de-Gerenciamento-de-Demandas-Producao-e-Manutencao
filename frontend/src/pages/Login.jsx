import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-surface-muted">
            {/* Left Side - Branding/Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-hover to-primary opacity-90"></div>
                <div className="relative z-10 text-white p-12 max-w-lg">
                    <h1 className="text-5xl font-bold mb-6">Sistema de Demandas</h1>
                    <p className="text-xl text-indigo-100 leading-relaxed">
                        Gerencie ordens de serviço, aprovações e execuções. Manutenção e Produção
                    </p>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white p-10 rounded-2xl shadow-soft">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold text-gray-900">Bem-vindo</h2>
                            <p className="text-gray-500 mt-2">Faça login para acessar sua conta</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-error p-4 rounded-lg mb-6 text-sm flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none text-gray-900"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none text-gray-900"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>
                    </div>
                    <p className="text-center text-gray-500 text-sm mt-8">
                        2025 Sistema de Demandas. Feito por Hendel / Ederson Supervisão: Gabriel Borges.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
