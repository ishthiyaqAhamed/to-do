'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign in. Check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-5">
      <div className="hidden md:flex md:col-span-2 bg-ink text-paper flex-col justify-between p-10">
        <span className="font-display text-2xl tracking-tight">Ledger</span>
        <div>
          <p className="font-display text-3xl leading-snug mb-3">
            Every job, tracked from open ticket to closed.
          </p>
          <p className="text-sm text-paper/70 max-w-xs">
            A shared board for a team to open work, claim it, and move it through to done.
          </p>
        </div>
        <span className="text-xs text-paper/50">Job Ticket Board System</span>
      </div>

      <div className="md:col-span-3 flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h1 className="font-display text-2xl mb-1">Sign in</h1>
          <p className="text-sm text-slate mb-8">Enter your credentials to reach your board.</p>

          {error && (
            <div className="mb-4 border-l-2 border-brick pl-3 py-1 text-sm text-brick">
              {error}
            </div>
          )}

          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 border border-line bg-white px-3 py-2 text-sm rounded focus:border-brass"
          />

          <label className="block text-sm mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 border border-line bg-white px-3 py-2 text-sm rounded focus:border-brass"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-paper py-2.5 text-sm font-medium rounded hover:bg-ink/90 disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-sm text-slate mt-6">
            New here?{' '}
            <Link href="/register" className="text-ink underline underline-offset-2">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}