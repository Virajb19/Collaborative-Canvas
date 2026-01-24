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
        .map((user) => {
          // Generate a lighter shade for the gradient
          const baseColor = user.color;

          return (
            <div
              key={user.id}
              className="pointer-events-none absolute transition-all duration-75 ease-out"
              style={{
                left: user.cursor!.x,
                top: user.cursor!.y,
                transform: 'translate(-3px, -3px)',
              }}
            >
              {/* Tilted triangle cursor with gradient and glow */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                className="drop-shadow-lg"
                style={{
                  filter: `drop-shadow(0 2px 4px ${baseColor}50) drop-shadow(0 0 8px ${baseColor}30)`,
                  transform: 'rotate(-12deg)',
                }}
              >
                {/* Gradient definition */}
                <defs>
                  <linearGradient id={`cursor-gradient-${user.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={baseColor} stopOpacity="1" />
                    <stop offset="50%" stopColor={baseColor} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={baseColor} stopOpacity="0.7" />
                  </linearGradient>
                  {/* Glow filter */}
                  <filter id={`glow-${user.id}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Main triangle cursor - tilted and pointer-like */}
                <path
                  d="M4 2L4 22L9.5 16.5L14 24L17 22.5L12.5 15L20 14L4 2Z"
                  fill={`url(#cursor-gradient-${user.id})`}
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  filter={`url(#glow-${user.id})`}
                />
                {/* Inner highlight for depth */}
                <path
                  d="M6 5L6 18L9 15L12.5 21L14.5 20L11 13.5L16 13L6 5Z"
                  fill="white"
                  fillOpacity="0.25"
                />
              </svg>
              {/* User name label with gradient background */}
              <div
                className="absolute left-5 top-5 px-2.5 py-1 rounded-lg text-xs font-semibold text-white whitespace-nowrap shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}, ${baseColor}dd)`,
                  boxShadow: `0 2px 8px ${baseColor}40, 0 0 12px ${baseColor}20`,
                }}
              >
                {user.name}
              </div>
            </div>
          );
        })}
    </>
  );
};
