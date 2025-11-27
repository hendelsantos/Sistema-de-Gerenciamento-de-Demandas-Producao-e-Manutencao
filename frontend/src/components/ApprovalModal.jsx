import React, { useState } from 'react';

const ApprovalModal = ({ isOpen, onClose, onConfirm, title, type }) => {
    const [justificativa, setJustificativa] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(justificativa);
        setJustificativa('');
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
