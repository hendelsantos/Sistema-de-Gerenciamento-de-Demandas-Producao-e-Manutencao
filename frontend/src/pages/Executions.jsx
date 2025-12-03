import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ExecutionModal from '../components/ExecutionModal';

const Executions = () => {
    const { user } = useAuth();
    const [demands, setDemands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDemand, setSelectedDemand] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchDemands();
    }, [page]);

    const fetchDemands = async () => {
        try {
            setLoading(true);
            const status = 'aguardando_execucao,executando';
            const response = await api.get(`/demands?page=${page}&per_page=8&status=${status}`);

            if (response.data.demands) {
                setDemands(response.data.demands);
                setTotalPages(response.data.pages);
            } else {
                setDemands(response.data);
            }
        } catch (error) {
            console.error('Error fetching demands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (formData) => {
        try {
            const endpoint = modalType === 'start'
                ? `/demands/${selectedDemand.id}/start-execution`
                : `/demands/${selectedDemand.id}/finish-execution`;

            await api.post(endpoint, formData);

            // Refresh list
            fetchDemands();
            setSelectedDemand(null);
            setModalType(null);
        } catch (error) {
            console.error('Action failed:', error);
            alert('Falha ao processar ação');
        }
    };

    const openModal = (demand, type) => {
        setSelectedDemand(demand);
        setModalType(type);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Execução de Demandas</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie e execute as ordens de serviço</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {demands.map(demand => (
                    <div key={demand.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col aspect-[4/5] w-full relative overflow-hidden group/card">

                        {/* Status Badge - Absolute Top Right */}
                        <div className="absolute top-3 right-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase shadow-sm ${demand.status === 'executando'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-blue-500 text-white'
                                }`}>
                                {demand.status === 'executando' ? 'Em Andamento' : 'Aguardando'}
                            </span>
                        </div>

                        {/* ID */}
                        <span className="font-mono text-[9px] font-bold text-gray-300 dark:text-gray-600 mb-2">#{demand.id}</span>

                        {/* Content */}
                        <div className="flex-1 flex flex-col items-center text-center px-1">
                            <Link to={`/demands/${demand.id}`} className="block group w-full">
                                <h3 className="text-base font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors leading-tight">
                                    {demand.titulo}
                                </h3>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-4 leading-relaxed">
                                    {demand.problema}
                                </p>
                            </Link>
                        </div>

                        {/* Equipment Info */}
                        <div className="flex flex-col items-center justify-center py-3 border-t border-gray-50 dark:border-gray-700/50 w-full mt-2">
                            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Equipamento</span>
                            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{demand.equipamento}</span>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center w-full pt-1">
                            {demand.status === 'aguardando_execucao' ? (
                                <button
                                    onClick={() => openModal(demand, 'start')}
                                    className="px-6 py-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 text-[10px] font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    Iniciar Execução
                                </button>
                            ) : (
                                <button
                                    onClick={() => openModal(demand, 'finish')}
                                    className="px-6 py-1.5 rounded-full bg-green-500 text-white hover:bg-green-600 text-[10px] font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    Finalizar Execução
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        Anterior
                    </button>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Página {page} de {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        Próxima
                    </button>
                </div>
            )}

            {demands.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sem tarefas pendentes</h3>
                    <p className="text-gray-500 dark:text-gray-400">Não há demandas aguardando execução no momento.</p>
                </div>
            )}

            {selectedDemand && (
                <ExecutionModal
                    isOpen={!!selectedDemand}
                    onClose={() => { setSelectedDemand(null); setModalType(null); }}
                    onConfirm={handleAction}
                    type={modalType}
                />
            )}
        </div>
    );
};

export default Executions;
