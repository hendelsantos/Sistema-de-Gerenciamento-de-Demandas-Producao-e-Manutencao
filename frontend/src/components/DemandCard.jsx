import React from 'react';
import { Link } from 'react-router-dom';

const statusColors = {
    pendente_aprovacao_1: 'bg-yellow-100 text-yellow-800',
    rejeitado_aprovacao_1: 'bg-red-100 text-red-800',
    pendente_aprovacao_2: 'bg-orange-100 text-orange-800',
    rejeitado_aprovacao_2: 'bg-red-100 text-red-800',
    aguardando_execucao: 'bg-blue-100 text-blue-800',
    executando: 'bg-purple-100 text-purple-800',
    concluido: 'bg-green-100 text-green-800',
};

const statusLabels = {
    pendente_aprovacao_1: 'Aprovação Nível 1',
    rejeitado_aprovacao_1: 'Rejeitado Nível 1',
    pendente_aprovacao_2: 'Aprovação Nível 2',
    rejeitado_aprovacao_2: 'Rejeitado Nível 2',
    aguardando_execucao: 'Aguardando Execução',
    executando: 'Em Execução',
    concluido: 'Concluído',
};

const DemandCard = ({ demand }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{demand.titulo}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[demand.status] || 'bg-gray-100'}`}>
                    {statusLabels[demand.status] || demand.status}
                </span>
            </div>
            <p className="text-gray-600 mb-2 line-clamp-2">{demand.problema}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                <span>GUT: {demand.gut}</span>
                <span>{new Date(demand.data_criacao).toLocaleDateString()}</span>
            </div>
            <Link
                to={`/demands/${demand.id}`}
                className="block mt-4 text-center bg-gray-50 hover:bg-gray-100 text-blue-600 font-semibold py-2 rounded-md transition-colors"
            >
                Ver Detalhes
            </Link>
        </div>
    );
};

export default DemandCard;
