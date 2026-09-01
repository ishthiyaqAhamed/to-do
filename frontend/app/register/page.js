'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account.');
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
            Open an account, open your first ticket.
          </p>
          <p className="text-sm text-paper/70 max-w-xs">
            New accounts start as standard members — an administrator manages elevated access separately.
          </p>
        </div>
        <span className="text-xs text-paper/50">Job Ticket Board System</span>
      </div>

      <div className="md:col-span-3 flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h1 className="font-display text-2xl mb-1">Create an account</h1>
          <p className="text-sm text-slate mb-8">Takes a moment — you'll land straight on your board.</p>

          {error && (
            <div className="mb-4 border-l-2 border-brick pl-3 py-1 text-sm text-brick">
              {error}
            </div>
          )}

          <label className="block text-sm mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 border border-line bg-white px-3 py-2 text-sm rounded focus:border-brass"
          />

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 border border-line bg-white px-3 py-2 text-sm rounded focus:border-brass"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-paper py-2.5 text-sm font-medium rounded hover:bg-ink/90 disabled:opacity-50"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-sm text-slate mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-ink underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}