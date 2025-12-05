import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const KanbanColumn = ({ title, demands, statusColor, badgeColor }) => (
    <div className="flex-1 min-w-[320px] max-w-[360px] flex flex-col h-full mr-6">
        <div className="flex items-center justify-between mb-4 px-1">
            <h3 className={`font-bold text-sm tracking-wider uppercase ${statusColor}`}>{title}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeColor}`}>
                {demands.length}
            </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar pb-4">
            {demands.map(demand => (
                <Link
                    to={`/demands/${demand.id}`}
                    key={demand.id}
                    className="block bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-200 group"
                >
                    <div className="flex justify-between items-start mb-3">
                        <span className="font-mono text-xs font-medium text-gray-400 dark:text-gray-500">#{demand.id}</span>
                        <div className="flex gap-2">
                            {demand.classificacao && (
                                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-800">
                                    {demand.classificacao}
                                </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${demand.gut >= 100 ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' :
                                demand.gut >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' :
                                    'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                                }`}>
                                GUT: {demand.gut}
                            </span>
                        </div>
                    </div>

                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                        {demand.titulo}
                    </h4>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                        {demand.problema}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                                {demand.creator_name?.charAt(0) || 'U'}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[80px]">
                                {demand.creator_name}
                            </span>
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                            {new Date(demand.data_criacao).toLocaleDateString()}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    </div>
);

const KanbanBoard = () => {
    const [demands, setDemands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDemands();
    }, []);

    const fetchDemands = async () => {
        try {
            // Fetch more items for Kanban board to be useful
            const response = await api.get('/demands?per_page=100');
            if (response.data.demands) {
                setDemands(response.data.demands);
            } else {
                setDemands(response.data);
            }
        } catch (error) {
            console.error('Error fetching demands:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    const columns = [
        {
            title: 'Aprovação 1',
            status: 'pendente_aprovacao_1',
            color: 'text-yellow-600 dark:text-yellow-400',
            badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
        },
        {
            title: 'Aprovação 2',
            status: 'pendente_aprovacao_2',
            color: 'text-orange-600 dark:text-orange-400',
            badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
        },
        {
            title: 'Aguardando Execução',
            status: 'aguardando_execucao',
            color: 'text-blue-600 dark:text-blue-400',
            badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        },
        {
            title: 'Executando',
            status: 'executando',
            color: 'text-indigo-600 dark:text-indigo-400',
            badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
        },
        {
            title: 'Concluído',
            status: 'concluido',
            color: 'text-green-600 dark:text-green-400',
            badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
        }
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Quadro Kanban</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Acompanhamento visual do fluxo de demandas</p>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex h-full pb-2 min-w-max">
                    {columns.map(col => (
                        <KanbanColumn
                            key={col.status}
                            title={col.title}
                            statusColor={col.color}
                            badgeColor={col.badge}
                            demands={demands.filter(d => d.status === col.status)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
