import React, { useState } from 'react';

const ApprovalModal = ({ isOpen, onClose, onConfirm, title, type, showClassification }) => {
    const [justificativa, setJustificativa] = useState('');
    const [classificacao, setClassificacao] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(justificativa, classificacao);
        setJustificativa('');
        setClassificacao('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Justificativa (Opcional para aprovação)</label>
                        <textarea
                            value={justificativa}
                            onChange={(e) => setJustificativa(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            rows="3"
                            required={type === 'reject'}
                        />
                    </div>
                    {showClassification && (
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Classificação (GUT)</label>
                            <select
                                value={classificacao}
                                onChange={(e) => setClassificacao(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="H">H - Hoje</option>
                                <option value="A">A - Amanhã</option>
                                <option value="T">T - Temporário</option>
                                <option value="M">M - Manutenção Programada</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 text-white rounded-md ${type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApprovalModal;
