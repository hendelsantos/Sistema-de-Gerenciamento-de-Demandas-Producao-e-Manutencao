import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Sistema de Demandas</h1>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{user?.nome}</p>
                        <p className="text-xs text-gray-500">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                    title="Sair"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
