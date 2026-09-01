'use client';

import { useDraggable } from '@dnd-kit/core';

const STATUS_BAR = {
  todo: 'border-l-slate',
  doing: 'border-l-brass',
  done: 'border-l-forest',
};

function initials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function TaskCard({ task, currentUser, users, onClaim, onReassign, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
    : undefined;

  const isAdmin = currentUser.role === 'admin';
  const canDelete = isAdmin || task.creator?._id === currentUser.id || task.creator === currentUser.id;
  const shortId = task._id.slice(-5).toUpperCase();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-line border-l-[3px] ${STATUS_BAR[task.status]} rounded p-3 mb-2 ${
        isDragging ? 'shadow-md opacity-90' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          {...listeners}
          {...attributes}
          className="text-left flex-1 cursor-grab active:cursor-grabbing"
          aria-label={`Drag ticket ${task.title}`}
        >
          <p className="font-sans text-[10px] text-slate mb-1">#{shortId}</p>
          <p className="text-sm font-medium leading-snug">{task.title}</p>
        </button>
        {canDelete && (
          <button
            onClick={() => onDelete(task._id)}
            className="text-slate hover:text-brick text-xs"
            aria-label="Delete ticket"
          >
            ✕
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-slate mt-1.5 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5" title={task.creator?.name ? `Opened by ${task.creator.name}` : ''}>
          <span className="w-5 h-5 rounded-full bg-ink text-paper text-[9px] flex items-center justify-center">
            {initials(task.creator?.name)}
          </span>
          {task.assignedTo && (
            <>
              <span className="text-slate text-xs">→</span>
              <span
                className="w-5 h-5 rounded-full bg-brass text-paper text-[9px] flex items-center justify-center"
                title={`Assigned to ${task.assignedTo.name}`}
              >
                {initials(task.assignedTo.name)}
              </span>
            </>
          )}
        </div>

        {!task.assignedTo && !isAdmin && (
          <button
            onClick={() => onClaim(task._id)}
            className="text-xs border border-line px-2 py-1 rounded hover:border-brass hover:text-brass"
          >
            Claim
          </button>
        )}

        {isAdmin && (
          <select
            value={task.assignedTo?._id || task.assignedTo || ''}
            onChange={(e) => onReassign(task._id, e.target.value)}
            className="text-xs border border-line rounded px-1 py-1 bg-white max-w-[110px]"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}