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
                setDemands(response.data);
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard de Demandas</h1>
                <Link to="/demands/new" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg shadow-md transition-colors">
                    Nova Demanda
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3">Ref Nº</th>
                                <th className="px-4 py-3">Título</th>
                                <th className="px-4 py-3">Problema</th>
                                <th className="px-4 py-3">Processo</th>
                                <th className="px-4 py-3">Equip.</th>
                                <th className="px-4 py-3">GUT</th>
                                <th className="px-4 py-3">Foto</th>
                                <th className="px-4 py-3">Data Emissão</th>
                                <th className="px-4 py-3">Emitente</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Executor</th>
                                <th className="px-4 py-3">Ordem PM04</th>
                                <th className="px-4 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {demands.map((demand) => (
                                <tr key={demand.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">#{demand.id}</td>
                                    <td className="px-4 py-3">{demand.titulo}</td>
                                    <td className="px-4 py-3 truncate max-w-xs" title={demand.problema}>{demand.problema}</td>
                                    <td className="px-4 py-3">{demand.processo}</td>
                                    <td className="px-4 py-3">{demand.equipamento}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${demand.gut >= 100 ? 'bg-red-100 text-red-700' :
                                                demand.gut >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {demand.gut}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {demand.photos && demand.photos.length > 0 ? (
                                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{new Date(demand.data_criacao).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{demand.creator_name || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${demand.status === 'concluido' ? 'bg-green-50 text-green-700 border-green-200' :
                                                demand.status.includes('rejeitado') ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                            {demand.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{demand.execution?.executor_name || '-'}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{demand.execution?.pm04_id || '-'}</td>
                                    <td className="px-4 py-3">
                                        <Link to={`/demands/${demand.id}`} className="text-primary hover:text-primary-hover font-medium text-xs">
                                            Detalhes
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {demands.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Nenhuma demanda encontrada.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
