import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}`, { role: newRole });
            fetchUsers();
        } catch (error) {
            alert('Erro ao atualizar usuário');
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await api.put(`/admin/users/${userId}`, { ativo: newStatus });
            fetchUsers();
        } catch (error) {
            alert('Erro ao atualizar usuário');
        }
    };

    if (loading) return <div>Carregando usuários...</div>;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{user.nome}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="VISUALIZADOR">Visualizador</option>
                                    <option value="EMITENTE">Emitente</option>
                                    <option value="APROVADOR_1">Aprovador 1</option>
                                    <option value="APROVADOR_2">Aprovador 2</option>
                                    <option value="EXECUTOR">Executor</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() => handleStatusChange(user.id, !user.ativo)}
                                    className={`px-2 py-1 rounded text-xs font-semibold ${user.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                >
                                    {user.ativo ? 'Ativo' : 'Inativo'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
