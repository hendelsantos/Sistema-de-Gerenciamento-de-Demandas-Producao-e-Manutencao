import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ConfigForm = () => {
    const [config, setConfig] = useState({
        email_aprovador_1: '',
        email_aprovador_2: '',
        nome_aprovador_1: '',
        nome_aprovador_2: '',
        email_executor_default: ''
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await api.get('/admin/config');
                if (response.data.id) {
                    setConfig(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch config', error);
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/admin/config', config);
            alert('Configurações salvas com sucesso');
        } catch (error) {
            alert('Erro ao salvar configurações');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Configuração de E-mails</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-900 dark:text-gray-200 font-bold mb-2">Nome Aprovador Nível 1</label>
                    <input
                        type="text"
                        name="nome_aprovador_1"
                        value={config.nome_aprovador_1 || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-gray-900 dark:text-gray-200 font-bold mb-2">Email Aprovador Nível 1</label>
                    <input
                        type="email"
                        name="email_aprovador_1"
                        value={config.email_aprovador_1 || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-gray-900 dark:text-gray-200 font-bold mb-2">Nome Aprovador Nível 2</label>
                    <input
                        type="text"
                        name="nome_aprovador_2"
                        value={config.nome_aprovador_2 || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-gray-900 dark:text-gray-200 font-bold mb-2">Email Aprovador Nível 2</label>
                    <input
                        type="email"
                        name="email_aprovador_2"
                        value={config.email_aprovador_2 || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                </div>
                <div>
                    <label className="block text-gray-900 dark:text-gray-200 font-bold mb-2">Email Executor Padrão</label>
                    <input
                        type="email"
                        name="email_executor_default"
                        value={config.email_executor_default || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Salvar Configurações
                </button>
            </form>
        </div>
    );
};

export default ConfigForm;
