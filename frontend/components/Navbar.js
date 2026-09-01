'use client';

import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-line bg-paper">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-xl">Ledger</span>
          {user?.role === 'admin' && (
            <span className="text-xs border border-brass text-brass px-1.5 py-0.5 rounded">
              Administrator
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate">{user?.name}</span>
          <button
            onClick={logout}
            className="border border-line px-3 py-1.5 rounded hover:border-ink transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}