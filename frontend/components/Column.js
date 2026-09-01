'use client';

import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

const LABELS = { todo: 'To Do', doing: 'Doing', done: 'Done' };
const DOT = { todo: 'bg-slate', doing: 'bg-brass', done: 'bg-forest' };

export default function Column({ status, tasks, currentUser, users, onClaim, onReassign, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[260px] bg-line/20 rounded p-3 border ${
        isOver ? 'border-brass' : 'border-transparent'
      }`}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={`w-2 h-2 rounded-full ${DOT[status]}`} />
        <h2 className="text-sm font-medium">{LABELS[status]}</h2>
        <span className="text-xs text-slate">{tasks.length}</span>
      </div>

      {tasks.length === 0 && (
        <p className="text-xs text-slate px-1 py-4 text-center">Nothing here yet.</p>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          currentUser={currentUser}
          users={users}
          onClaim={onClaim}
          onReassign={onReassign}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}