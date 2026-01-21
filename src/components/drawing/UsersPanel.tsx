import type { User } from '~/types/drawing';
import { Users } from 'lucide-react';

interface UsersPanelProps {
  users: User[];
  currentUserId: string;
}

export const UsersPanel = ({ users, currentUserId }: UsersPanelProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-card rounded-xl shadow-panel p-3 min-w-[180px]">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
          <Users size={16} />
          <span>Online ({users.length})</span>
        </div>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: user.color }}
              />
              <span className="text-sm truncate">
                {user.name}
                {user.id === currentUserId && (
                  <span className="text-muted-foreground ml-1">(you)</span>
                )}
              </span>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-sm text-muted-foreground">Connecting...</p>
          )}
        </div>
      </div>
    </div>
  );
};
