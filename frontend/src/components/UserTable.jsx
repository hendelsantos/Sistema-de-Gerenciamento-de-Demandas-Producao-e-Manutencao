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

    const [newUser, setNewUser] = useState({ nome: '', email: '', hmc: '', password: '', role: 'VISUALIZADOR' });
    const [editingUser, setEditingUser] = useState(null);

    const handleCreateOrUpdateUser = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await api.put(`/admin/users/${editingUser.id}`, newUser);
                alert('Usuário atualizado com sucesso!');
                setEditingUser(null);
            } else {
                await api.post('/admin/users', newUser);
                alert('Usuário criado com sucesso!');
            }
            setNewUser({ nome: '', email: '', hmc: '', password: '', role: 'VISUALIZADOR' });
            fetchUsers();
        } catch (error) {
            alert(editingUser ? 'Erro ao atualizar usuário' : 'Erro ao criar usuário');
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setNewUser({
            nome: user.nome,
            email: user.email,
            hmc: user.hmc,
            password: '', // Password empty by default
            role: user.role
        });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setNewUser({ nome: '', email: '', hmc: '', password: '', role: 'VISUALIZADOR' });
    };

    if (loading) return <div>Carregando usuários...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
                    </h3>
                    {editingUser && (
                        <button
                            onClick={handleCancelEdit}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Cancelar Edição
                        </button>
                    )}
                </div>
                <form onSubmit={handleCreateOrUpdateUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                        <input
                            type="text"
                            value={newUser.nome}
                            onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">HMC</label>
                        <input
                            type="text"
                            value={newUser.hmc}
                            onChange={(e) => setNewUser({ ...newUser, hmc: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                        <input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                            required={!editingUser}
                            placeholder={editingUser ? "Deixe em branco para manter" : ""}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Função</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                        >
                            <option value="VISUALIZADOR">Visualizador</option>
                            <option value="EMITENTE">Emitente</option>
                            <option value="APROVADOR_1">Aprovador 1</option>
                            <option value="APROVADOR_2">Aprovador 2</option>
                            <option value="EXECUTOR">Executor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md transition-colors"
                    >
                        {editingUser ? 'Atualizar' : 'Adicionar'}
                    </button>
                </form>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">HMC</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.nome}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.hmc}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
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
                                        className={`px-2 py-1 rounded text-xs font-semibold ${user.ativo ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}
                                    >
                                        {user.ativo ? 'Ativo' : 'Inativo'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
