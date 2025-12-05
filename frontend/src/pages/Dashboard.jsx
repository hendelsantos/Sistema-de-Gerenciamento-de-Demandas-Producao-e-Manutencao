import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [demands, setDemands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDemands = async () => {
            try {
                const response = await api.get('/demands');
                // Backend now returns paginated response by default
                if (response.data.demands) {
                    setDemands(response.data.demands);
                } else {
                    setDemands(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch demands', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDemands();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Visão geral das demandas e status</p>
                </div>
                <Link to="/demands/new" className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Nova Demanda
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft dark:shadow-none overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4">Ref Nº</th>
                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Problema</th>
                                <th className="px-6 py-4">Processo</th>
                                <th className="px-6 py-4">Equip.</th>
                                <th className="px-6 py-4">GUT</th>
                                <th className="px-6 py-4">Foto</th>
                                <th className="px-6 py-4">Data Emissão</th>
                                <th className="px-6 py-4">Data Conclusão</th>
                                <th className="px-6 py-4">Emitente</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Executor</th>
                                <th className="px-6 py-4">Ordem PM04</th>
                                <th className="px-6 py-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {demands.map((demand) => (
                                <tr key={demand.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{demand.id}</td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">{demand.titulo}</td>
                                    <td className="px-6 py-4 truncate max-w-xs text-gray-600 dark:text-gray-400" title={demand.problema}>{demand.problema}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{demand.processo}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{demand.equipamento}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${demand.gut >= 100 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            demand.gut >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            }`}>
                                            {demand.gut}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {demand.photos && demand.photos.length > 0 ? (
                                            <svg className="w-5 h-5 text-primary dark:text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-600">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{new Date(demand.data_criacao).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{demand.execution?.data_fim ? new Date(demand.execution.data_fim).toLocaleDateString() : '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{demand.creator_name || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${demand.status === 'concluido' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900' :
                                            demand.status.includes('rejeitado') ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900' :
                                                'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900'
                                            }`}>
                                            {demand.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{demand.execution?.executor_name || '-'}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-500">{demand.execution?.pm04_id || '-'}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/demands/${demand.id}`} className="text-primary hover:text-primary-hover dark:text-primary-light dark:hover:text-white font-semibold text-sm transition-colors">
                                            Detalhes
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {demands.length === 0 && (
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma demanda encontrada.</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Crie uma nova demanda para começar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
