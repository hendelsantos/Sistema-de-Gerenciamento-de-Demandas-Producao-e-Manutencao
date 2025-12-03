import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [hmc, setHmc] = useState('');
    const [password, setPassword] = useState('');
    const { login, guestLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [showSignUp, setShowSignUp] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(hmc, password);
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">HMC (Registro)</label>
                                <input
                                    type="text"
                                    value={hmc}
                                    onChange={(e) => setHmc(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none text-gray-900"
                                    placeholder="Ex: 37100655"
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

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OU</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            <button
                                type="button"
                                onClick={async () => {
                                    setLoading(true);
                                    try {
                                        await guestLogin();
                                        navigate('/');
                                    } catch (err) {
                                        setError('Erro ao entrar como visitante.');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                Entrar como Visitante
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Não tem uma conta?{' '}
                                <button
                                    onClick={() => setShowSignUp(true)}
                                    className="text-primary hover:text-primary-hover font-semibold hover:underline"
                                >
                                    Cadastre-se
                                </button>
                            </p>
                        </div>
                    </div>
                    <p className="text-center text-gray-500 text-sm mt-8">
                        2025 Sistema de Demandas. Feito por Hendel / Ederson Supervisão: Gabriel Borges.
                    </p>
                </div>

                {/* Sign Up Modal */}
                {showSignUp && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center p-8 z-20 rounded-2xl">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full text-center relative">
                            <button
                                onClick={() => setShowSignUp(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Solicitar Acesso</h3>
                            <p className="text-gray-600 mb-6">
                                Para criar uma conta, envie um email solicitando acesso para:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 font-medium space-y-2 mb-6 break-words">
                                <p>hendel.santos@hyundai-brasil.com</p>
                                <p>ederson.moraes@hyundai-brasil.com</p>
                            </div>
                            <button
                                onClick={() => setShowSignUp(false)}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                            >
                                Entendi
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
