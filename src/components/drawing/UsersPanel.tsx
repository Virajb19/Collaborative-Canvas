import type { User } from '~/types/drawing';
import { Users, Crown, Circle } from 'lucide-react';
import type { RoomMemberWithUser } from '~/components/Room';
import { ScrollArea } from '~/components/ui/scroll-area';

interface UsersPanelProps {
  users: User[];
  currentUserId: string;
  roomMembers: RoomMemberWithUser[];
}

export const UsersPanel = ({ users, currentUserId, roomMembers }: UsersPanelProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-panel p-4 min-w-[240px] border border-border/50">

        {/* Online Users Section - For Color Legend */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            <Circle className="fill-green-500 text-green-500 w-2 h-2" />
            <span>Active Now ({users.length})</span>
          </div>
          <div className="space-y-2 mb-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white/10"
                  style={{ backgroundColor: user.color }}
                />
                <span className="text-sm font-medium truncate flex-1">
                  {user.name}
                  {user.id === currentUserId && (
                    <span className="text-muted-foreground font-normal ml-1.5 text-xs">(you)</span>
                  )}
                </span>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-muted-foreground px-2">Connecting...</p>
            )}
          </div>
        </div>

        <div className="h-px bg-border/50 my-2" />

        {/* Room Members Section - From DB */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            <Users className="w-3 h-3" />
            <span>Room Members ({roomMembers?.length || 0})</span>
          </div>
          <ScrollArea className="max-h-[200px] -mr-3 pr-3">
            <div className="space-y-2">
              {roomMembers?.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {/* Avatar placeholder or image could go here */}
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 ring-1 ring-border">
                      {member.user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-foreground/90 truncate">
                      {member.user.username}
                    </span>
                  </div>

                  {member.role === 'OWNER' && (
                    <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm">
                      <Crown className="w-3 h-3 fill-current" />
                      <span>OWNER</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  );
};
