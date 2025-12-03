import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const About = () => {
    const { user } = useAuth();
    const [bugs, setBugs] = useState([]);
    const [newBug, setNewBug] = useState('');
    const [loading, setLoading] = useState(true);
    const [responseMap, setResponseMap] = useState({});

    useEffect(() => {
        fetchBugs();
    }, []);

    const fetchBugs = async () => {
        try {
            const response = await api.get('/bugs');
            setBugs(response.data);
        } catch (error) {
            console.error('Failed to fetch bugs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitBug = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bugs', { description: newBug });
            setNewBug('');
            fetchBugs();
            alert('Bug reportado com sucesso!');
        } catch (error) {
            alert('Erro ao reportar bug');
        }
    };

    const handleRespond = async (bugId) => {
        const responseText = responseMap[bugId];
        if (!responseText) return;

        try {
            await api.post(`/bugs/${bugId}/respond`, { response: responseText });
            setResponseMap(prev => ({ ...prev, [bugId]: '' }));
            fetchBugs();
        } catch (error) {
            alert('Erro ao responder bug');
        }
    };

    const handleResponseChange = (bugId, value) => {
        setResponseMap(prev => ({ ...prev, [bugId]: value }));
    };

    const isDevOrAdmin = user.role === 'ADMIN' || user.role === 'EXECUTOR'; // Assuming Executor can also be a dev for now, or just Admin

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Project Info Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Sobre o Sistema</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Projeto para facilitar a comunicação e colaboração entre áreas. Sistema alinhado com o programa + Hyundai.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Desenvolvimento Frontend</h3>
                        <p className="text-gray-900 dark:text-white font-medium">Hendel</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Backend</h3>
                        <p className="text-gray-900 dark:text-white font-medium">Ederson / Hendel</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Supervisão</h3>
                        <p className="text-gray-900 dark:text-white font-medium">Gabriel Borges</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Versão</h3>
                        <p className="text-gray-900 dark:text-white font-medium">1.0</p>
                    </div>
                </div>
            </div>

            {/* Bug Reporting Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Relatar Bug / Sugestão</h2>

                <form onSubmit={handleSubmitBug} className="mb-8">
                    <div className="flex gap-4">
                        <textarea
                            value={newBug}
                            onChange={(e) => setNewBug(e.target.value)}
                            placeholder="Descreva o problema ou sugestão..."
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none h-24"
                            required
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-md transition-colors h-fit self-end"
                        >
                            Reportar
                        </button>
                    </div>
                </form>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Histórico de Relatos</h3>
                    {loading ? (
                        <div className="text-center py-4">Carregando...</div>
                    ) : bugs.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">Nenhum relato encontrado.</p>
                    ) : (
                        bugs.map((bug) => (
                            <div key={bug.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-gray-900 dark:text-white">{bug.reporter_name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(bug.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">{bug.description}</p>

                                {bug.developer_response ? (
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-100 dark:border-green-900/30">
                                        <p className="text-sm font-bold text-green-800 dark:text-green-400 mb-1">
                                            Resposta do Desenvolvedor ({bug.responder_name}):
                                        </p>
                                        <p className="text-green-700 dark:text-green-300">{bug.developer_response}</p>
                                    </div>
                                ) : (
                                    isDevOrAdmin && (
                                        <div className="mt-4 flex gap-2">
                                            <input
                                                type="text"
                                                value={responseMap[bug.id] || ''}
                                                onChange={(e) => handleResponseChange(bug.id, e.target.value)}
                                                placeholder="Responder..."
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                            <button
                                                onClick={() => handleRespond(bug.id)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                                            >
                                                Enviar
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default About;
