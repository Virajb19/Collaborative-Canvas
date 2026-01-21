# Collaborative Drawing Canvas 🎨

A real-time collaborative drawing application built with **Next.js 15**, **Socket.io**, and **Prisma**. Multiple users can draw simultaneously on a shared canvas with live cursor tracking, undo/redo support, and room-based collaboration.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-blue?logo=socketdotio)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)

## ✨ Features

- **Real-time collaborative drawing** - Multiple users can draw simultaneously
- **Live cursor tracking** - See other users' cursors in real-time
- **Room-based collaboration** - Create/join rooms with passcode protection
- **Drawing tools** - Brush and eraser with customizable colors and widths
- **Undo/Redo** - Full undo/redo support across all connected users
- **User presence** - See who's currently in the room
- **Responsive canvas** - DPR-aware rendering for crisp lines on all displays

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ 
- pnpm (v9.14.4 recommended)
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd drawingcanvas

# Install dependencies
pnpm install
# OR
npm install
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/drawingcanvas"

# NextAuth
AUTH_SECRET="your-auth-secret-here"  # Generate with: npx auth secret

# Socket.io Server
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
SOCKET_PORT=3001
```

### Database Setup

```bash
# Push the schema to your database
pnpm db:push

# Or run migrations
pnpm db:generate
pnpm db:migrate
```

### Running the Application

You need to run **two terminals** - one for the Next.js app and one for the Socket.io server:

**Terminal 1 - Next.js Development Server:**
```bash
npm run dev
# or
pnpm dev
```

**Terminal 2 - Socket.io Server:**
```bash
npm run socket
# or
pnpm socket
```

The application will be available at:
- **Web App**: http://localhost:3000
- **Socket Server**: http://localhost:3001

---

## 👥 Testing with Multiple Users

### Local Testing

1. **Start both servers** as described above
2. **Open multiple browser windows** or tabs to http://localhost:3000
3. **Create a room** in one window (you'll get a Room ID and set a passcode)
4. **Join the room** from other windows using the Room ID and passcode
5. **Draw!** - You should see real-time updates across all windows

### Testing Scenarios

| Scenario | How to Test |
|----------|-------------|
| Real-time drawing | Draw in one window, observe updates in others |
| Cursor tracking | Move mouse in one window, see cursor in others |
| Undo/Redo | Press Ctrl+Z / Ctrl+Y, observe global state changes |
| User presence | Join/leave room, see user list updates |
| Canvas clear | Clear canvas, observe on all clients |

### Network Testing

To test with different devices on the same network:

1. Find your local IP: `hostname -I` (Linux) or `ipconfig` (Windows)
2. Update `.env`:
   ```env
   NEXT_PUBLIC_SOCKET_URL="http://YOUR_LOCAL_IP:3001"
   ```
3. Access the app from other devices using your local IP

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components (Canvas, Toolbar, Dialogs)
├── hooks/
│   ├── useSocket.ts               # Socket.io connection management
│   ├── useCollaborativeDrawing.tsx # Undo/redo & state management
│   └── useDrawingCanvas.tsx       # Canvas rendering & input handling
├── lib/
│   ├── socket.ts           # Socket.io client singleton
│   ├── socket.events.ts    # Event name constants
│   └── zod.ts              # Validation schemas
├── server/
│   └── api/routers/        # tRPC API routes
└── types/
    └── drawing.ts          # TypeScript type definitions
```

---

## ⚠️ Known Limitations & Bugs

### Current Limitations

| Limitation | Description |
|------------|-------------|
| **Local undo/redo stacks** | Undo/redo history is stored per-user locally; refreshing the page loses undo history |
| **No canvas persistence** | Canvas data is stored in memory on the socket server; restarting the server clears all drawings |
| **No reconnection recovery** | If connection drops mid-stroke, that stroke may be lost |
| **Single tool at a time** | Only brush and eraser tools available |
| **No zoom/pan** | Canvas is fixed size, no viewport controls |

### Known Bugs

1. **Race condition on rapid undo** - Very fast undo operations may occasionally cause state desync
2. **Cursor jitter** - Cursor positions may flicker on high-latency connections
3. **Memory growth** - Long drawing sessions accumulate strokes in memory without cleanup

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile browsers (touch works but less tested)

---

## ⏱️ Time Spent on Project

| Phase | Time |
|-------|------|
| Initial T3 setup & auth | ~2 hours |
| Socket.io integration | ~4 hours |
| Canvas drawing implementation | ~3 hours |
| Collaborative features (cursors, presence) | ~3 hours |
| Undo/Redo implementation | ~2 hours |
| Room management (create, join, delete) | ~2 hours |
| UI/UX & dialogs | ~2 hours |
| Bug fixes & refinements | ~2 hours |
| **Total** | **~20 hours** |

---

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Next.js development server |
| `pnpm socket` | Start Socket.io server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm db:push` | Push Prisma schema to database |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |

---

## 📄 License

MIT License - feel free to use this project as you wish!
