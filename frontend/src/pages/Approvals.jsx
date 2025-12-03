import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ApprovalModal from '../components/ApprovalModal';

const Approvals = () => {
    const { user } = useAuth();
    const [demands, setDemands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDemand, setSelectedDemand] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchDemands();
    }, [page, user.role]);

    const fetchDemands = async () => {
        try {
            setLoading(true);
            let status = '';
            if (user.role === 'APROVADOR_1') status = 'pendente_aprovacao_1';
            else if (user.role === 'APROVADOR_2') status = 'pendente_aprovacao_2';
            else if (user.role === 'ADMIN') status = 'pendente_aprovacao_1,pendente_aprovacao_2';

            const response = await api.get(`/demands?page=${page}&per_page=8&status=${status}`);

            if (response.data.demands) {
                setDemands(response.data.demands);
                setTotalPages(response.data.pages);
            } else {
                // Fallback for non-paginated response (shouldn't happen with new backend)
                setDemands(response.data);
            }
        } catch (error) {
            console.error('Error fetching demands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (justificativa, classificacao) => {
        try {
            const endpoint = modalType === 'approve_1' ? `/demands/${selectedDemand.id}/approve-level-1` :
                modalType === 'approve_2' ? `/demands/${selectedDemand.id}/approve-level-2` :
                    modalType === 'reject_1' ? `/demands/${selectedDemand.id}/reject-level-1` :
                        `/demands/${selectedDemand.id}/reject-level-2`;

            const payload = { justificativa };
            if (classificacao) payload.classificacao = classificacao;

            await api.post(endpoint, payload);

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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Aprovações Pendentes</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie as demandas que aguardam sua aprovação</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {demands.map(demand => (
                    <div key={demand.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col aspect-[4/5] w-full relative overflow-hidden group/card">

                        {/* Status Badge - Absolute Top Right */}
                        <div className="absolute top-3 right-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase shadow-sm ${demand.gut >= 100 ? 'bg-red-500 text-white' :
                                demand.gut >= 50 ? 'bg-amber-500 text-white' :
                                    'bg-emerald-500 text-white'
                                }`}>
                                GUT: {demand.gut}
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

                        {/* Creator Info */}
                        <div className="flex flex-col items-center justify-center py-3 border-t border-gray-50 dark:border-gray-700/50 w-full mt-2">
                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 ring-2 ring-white dark:ring-gray-800">
                                {demand.creator_name?.charAt(0)}
                            </div>
                            <span className="text-[9px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">{demand.creator_name}</span>
                            <span className="text-[9px] text-gray-300 dark:text-gray-600">{new Date(demand.data_criacao).toLocaleDateString()}</span>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center gap-2 w-full pt-1">
                            <button
                                onClick={() => openModal(demand, user.role === 'APROVADOR_1' ? 'reject_1' : 'reject_2')}
                                className="px-4 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 text-[10px] font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                            >
                                Rejeitar
                            </button>
                            <button
                                onClick={() => openModal(demand, user.role === 'APROVADOR_1' ? 'approve_1' : 'approve_2')}
                                className="px-4 py-1.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 text-[10px] font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                            >
                                Aprovar
                            </button>
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
                        <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tudo em dia!</h3>
                    <p className="text-gray-500 dark:text-gray-400">Nenhuma demanda pendente de aprovação no momento.</p>
                </div>
            )}

            {selectedDemand && (
                <ApprovalModal
                    isOpen={!!selectedDemand}
                    onClose={() => { setSelectedDemand(null); setModalType(null); }}
                    onConfirm={handleAction}
                    type={modalType?.includes('reject') ? 'reject' : 'approve'}
                    showClassification={modalType === 'approve_2'}
                />
            )}
        </div>
    );
};

export default Approvals;
