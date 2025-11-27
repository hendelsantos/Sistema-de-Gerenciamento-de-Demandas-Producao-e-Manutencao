import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const NewDemand = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titulo: '',
        problema: '',
        processo: '',
        equipamento: '',
        gut: 1,
        photos: [] // Placeholder for photo URLs
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/demands', formData);
            navigate('/');
        } catch (error) {
            console.error('Erro ao criar demanda:', error);
            const errorMsg = error.response?.data?.msg || error.response?.data?.message || 'Erro ao criar demanda';
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Nova Demanda</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-soft space-y-6 border border-gray-100">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"
                            placeholder="Resumo do problema"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Problema Detalhado</label>
                        <textarea
                            name="problema"
                            value={formData.problema}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none h-32 resize-none"
                            placeholder="Descreva o problema em detalhes..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Processo</label>
                        <input
                            type="text"
                            name="processo"
                            value={formData.processo}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"
                            placeholder="Ex: Cabine Pintura"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Equipamento</label>
                        <input
                            type="text"
                            name="equipamento"
                            value={formData.equipamento}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"
                            placeholder="Ex: R12"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade (GUT)</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="gut"
                                value={formData.gut}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors outline-none"
                                min="1"
                                max="5"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 text-sm">
                                (1-5)
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-6 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Criando...' : 'Criar Demanda'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewDemand;
