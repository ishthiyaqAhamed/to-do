'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext } from '@dnd-kit/core';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Column from '@/components/Column';
import NewTicketForm from '@/components/NewTicketForm';

const STATUSES = ['todo', 'doing', 'done'];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  const fetchTasks = useCallback(async () => {
    const res = await api.get('/tasks');
    setTasks(res.data);
  }, []);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        setLoading(true);
        await fetchTasks();
        if (user.role === 'admin') {
          const res = await api.get('/users');
          setUsers(res.data);
        }
      } catch (err) {
        setError('Could not load the board. Try refreshing.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, fetchTasks]);

  const handleCreate = async ({ title, description, assignToSelf }) => {
    const res = await api.post('/tasks', { title, description, assignToSelf });
    setTasks((prev) => [res.data, ...prev]);
  };

  const handleClaim = async (taskId) => {
    const res = await api.patch(`/tasks/${taskId}/assign`, {});
    setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
  };

  const handleReassign = async (taskId, userId) => {
    const res = await api.patch(`/tasks/${taskId}/assign`, { userId: userId || null });
    setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
  };

  const handleDelete = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;
    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === newStatus) return;

    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
    } catch (err) {
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: task.status } : t)));
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="font-display text-2xl mb-1">Board</h1>
        <p className="text-sm text-slate mb-6">
          {user.role === 'admin' ? 'Full visibility across every ticket.' : 'Claim open work, move it through to done.'}
        </p>

        <NewTicketForm onCreate={handleCreate} />

        {error && <p className="text-sm text-brick mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-slate">Loading tickets…</p>
        ) : (
          <DndContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STATUSES.map((status) => (
                <Column
                  key={status}
                  status={status}
                  tasks={tasks.filter((t) => t.status === status)}
                  currentUser={user}
                  users={users}
                  onClaim={handleClaim}
                  onReassign={handleReassign}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </DndContext>
        )}
      </main>
    </div>
  );
}