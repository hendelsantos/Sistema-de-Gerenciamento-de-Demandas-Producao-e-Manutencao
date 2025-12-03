import React from 'react';
import UserTable from '../components/UserTable';
import ConfigForm from '../components/ConfigForm';

const Admin = () => {
    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Painel Administrativo</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Gerenciar Usuários</h2>
                    <UserTable />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Configurações do Sistema</h2>
                    <ConfigForm />
                </div>
            </div>
        </div>
    );
};

export default Admin;
