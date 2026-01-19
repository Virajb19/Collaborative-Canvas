import type { User } from '~/types/drawing';

interface UserCursorsProps {
  users: User[];
  currentUserId: string;
}

export const UserCursors = ({ users, currentUserId }: UserCursorsProps) => {
  return (
    <>
      {users
        .filter((user) => user.id !== currentUserId && user.cursor)
        .map((user) => (
          <div
            key={user.id}
            className="pointer-events-none absolute transition-all duration-75 ease-out cursor-pulse"
            style={{
              left: user.cursor!.x,
              top: user.cursor!.y,
              transform: 'translate(-2px, -2px)',
            }}
          >
            {/* Cursor arrow */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-cursor"
            >
              <path
                d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.44c.45 0 .67-.54.35-.85L6.35 3.29a.5.5 0 0 0-.85.35z"
                fill={user.color}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            {/* User name label */}
            <div
              className="absolute left-4 top-4 px-2 py-0.5 rounded text-xs font-medium text-white whitespace-nowrap shadow-cursor"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </div>
        ))}
    </>
  );
};
