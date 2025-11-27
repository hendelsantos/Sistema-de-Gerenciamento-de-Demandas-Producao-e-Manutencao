import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${active
                ? 'bg-primary text-white border-r-4 border-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
    >
        <span className="mr-3">{icon}</span>
        {label}
    </Link>
);

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col shadow-xl z-20">
            <div className="h-16 flex items-center px-6 bg-gray-900 border-b border-gray-800">
                <h2 className="text-xl font-bold tracking-wider text-white">DEMANDAS</h2>
            </div>

            <nav className="flex-1 py-6 space-y-1">
                <SidebarItem
                    to="/"
                    active={isActive('/')}
                    label="Dashboard"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>}
                />
                <SidebarItem
                    to="/demands/new"
                    active={isActive('/demands/new')}
                    label="Nova Demanda"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>}
                />

                {['APROVADOR_1', 'APROVADOR_2', 'ADMIN'].includes(user?.role) && (
                    <SidebarItem
                        to="/approvals"
                        active={isActive('/approvals')}
                        label="Aprovações"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    />
                )}

                {['EXECUTOR', 'ADMIN'].includes(user?.role) && (
                    <SidebarItem
                        to="/executions"
                        active={isActive('/executions')}
                        label="Execução"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>}
                    />
                )}

                {user?.role === 'ADMIN' && (
                    <SidebarItem
                        to="/admin"
                        active={isActive('/admin')}
                        label="Admin"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
                    />
                )}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {user?.nome?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">{user?.nome}</p>
                        <p className="text-xs text-gray-400">{user?.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
