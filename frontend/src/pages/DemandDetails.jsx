import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ApprovalModal from '../components/ApprovalModal';
import ExecutionModal from '../components/ExecutionModal';

const DemandDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [demand, setDemand] = useState(null);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 'approve_1', 'reject_1', 'approve_2', 'reject_2', 'finish_execution'

    const fetchDemand = async () => {
        try {
            const response = await api.get(`/demands/${id}`);
            setDemand(response.data);
        } catch (error) {
            console.error('Failed to fetch demand', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDemand();
    }, [id]);

    const handleAction = async (action, data = {}) => {
        try {
            let endpoint = '';
            if (action === 'approve_1') endpoint = `/demands/${id}/aprovar-nivel-1`;
            if (action === 'reject_1') endpoint = `/demands/${id}/rejeitar-nivel-1`;
            if (action === 'approve_2') endpoint = `/demands/${id}/aprovar-nivel-2`;
            if (action === 'reject_2') endpoint = `/demands/${id}/rejeitar-nivel-2`;
            if (action === 'start_execution') endpoint = `/demands/${id}/execucao/iniciar`;
            if (action === 'finish_execution') endpoint = `/demands/${id}/execucao/finalizar`;

            await api.post(endpoint, data);
            setModalOpen(false);
            fetchDemand();
        } catch (error) {
            alert('Erro ao processar ação');
        }
    };

    const openModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    if (loading) return <div className="p-6">Carregando...</div>;
    if (!demand) return <div className="p-6">Demanda não encontrada.</div>;

    const canApprove1 = (user.role === 'APROVADOR_1' || user.role === 'ADMIN') && demand.status === 'pendente_aprovacao_1' && user.role !== 'VISUALIZADOR';
    const canApprove2 = (user.role === 'APROVADOR_2' || user.role === 'ADMIN') && demand.status === 'pendente_aprovacao_2' && user.role !== 'VISUALIZADOR';
    const canStartExecution = (user.role === 'EXECUTOR' || user.role === 'ADMIN') && demand.status === 'aguardando_execucao' && user.role !== 'VISUALIZADOR';
    const canFinishExecution = (user.role === 'EXECUTOR' || user.role === 'ADMIN') && demand.status === 'executando' && user.role !== 'VISUALIZADOR';

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Voltar"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">{demand.titulo}</h1>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {demand.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 className="text-gray-500 font-semibold text-sm uppercase">Problema</h3>
                        <p className="text-gray-800 mt-1">{demand.problema}</p>
                    </div>
                    <div>
                        <h3 className="text-gray-500 font-semibold text-sm uppercase">Equipamento</h3>
                        <p className="text-gray-800 mt-1">{demand.equipamento}</p>
                    </div>
                    <div>
                        <h3 className="text-gray-500 font-semibold text-sm uppercase">Processo</h3>
                        <p className="text-gray-800 mt-1">{demand.processo}</p>
                    </div>
                    <div>
                        <h3 className="text-gray-500 font-semibold text-sm uppercase">GUT</h3>
                        <p className="text-gray-800 mt-1">{demand.gut}</p>
                    </div>
                    <div>
                        <h3 className="text-gray-500 font-semibold text-sm uppercase">Criado por</h3>
                        <p className="text-gray-800 mt-1">{demand.creator_name}</p>
                    </div>
                    <div>
                        <h3 className="text-gray-500 font-semibold text-sm uppercase">Data</h3>
                        <p className="text-gray-800 mt-1">{new Date(demand.data_criacao).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Photos Gallery */}
                {demand.photos && demand.photos.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-gray-500 font-semibold text-sm uppercase mb-3">Fotos Anexadas</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {demand.photos.map((photo) => (
                                <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                    <img
                                        src={`http://127.0.0.1:5000${photo.url}`}
                                        alt="Evidência"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onClick={() => window.open(`http://127.0.0.1:5000${photo.url}`, '_blank')}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 border-t pt-6">
                    {canApprove1 && (
                        <>
                            <button onClick={() => openModal('approve_1')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Aprovar Nível 1</button>
                            <button onClick={() => openModal('reject_1')} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Rejeitar Nível 1</button>
                        </>
                    )}
                    {canApprove2 && (
                        <>
                            <button onClick={() => openModal('approve_2')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Aprovar Nível 2</button>
                            <button onClick={() => openModal('reject_2')} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Rejeitar Nível 2</button>
                        </>
                    )}
                    {canStartExecution && (
                        <button onClick={() => handleAction('start_execution')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Iniciar Execução</button>
                    )}
                    {canFinishExecution && (
                        <button onClick={() => openModal('finish_execution')} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Finalizar Execução</button>
                    )}
                </div>
            </div>

            {/* Modals */}
            <ApprovalModal
                isOpen={modalOpen && ['approve_1', 'reject_1', 'approve_2', 'reject_2'].includes(modalType)}
                onClose={() => setModalOpen(false)}
                onConfirm={(justificativa, classificacao, gut) => handleAction(modalType, { justificativa, classificacao, gut })}
                title={modalType?.includes('approve') ? 'Aprovar Demanda' : 'Rejeitar Demanda'}
                type={modalType?.includes('approve') ? 'approve' : 'reject'}
                showClassification={modalType === 'approve_2'}
                showGutRevision={modalType === 'approve_1'}
                currentGut={demand?.gut}
            />

            <ExecutionModal
                isOpen={modalOpen && modalType === 'finish_execution'}
                onClose={() => setModalOpen(false)}
                onConfirm={(data) => handleAction('finish_execution', data)}
                title="Finalizar Execução"
            />
        </div>
    );
};

export default DemandDetails;
