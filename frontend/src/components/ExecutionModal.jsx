import React, { useState } from 'react';

const ExecutionModal = ({ isOpen, onClose, onConfirm, title }) => {
    const [formData, setFormData] = useState({
        descricao_atividade: '',
        observacao: '',
        foto_final: '', // Placeholder
        pm04_id: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Descrição da Atividade</label>
                        <textarea
                            name="descricao_atividade"
                            value={formData.descricao_atividade}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                            rows="3"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Nº Ordem PM04</label>
                        <input
                            type="text"
                            name="pm04_id"
                            value={formData.pm04_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Ex: 123456"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Observação</label>
                        <textarea
                            name="observacao"
                            value={formData.observacao}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                            rows="2"
                        />
                    </div>
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
                            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                            Finalizar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExecutionModal;
