"use client"

import { useState, useEffect } from 'react';
import { Pencil, Users, Zap, ArrowRight, Sparkles, MousePointer2, Palette, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { useSession } from 'next-auth/react';

const STAR_COLORS = [
  "text-red-400 fill-red-300",
  "text-orange-400 fill-orange-300",
  "text-yellow-400 fill-yellow-300",
  "text-green-400 fill-green-300",
  "text-blue-400 fill-blue-300",
  "text-indigo-400 fill-indigo-300",
  "text-purple-400 fill-purple-300",
  "text-pink-400 fill-pink-300",
];

const pick = (arr: string[], seed: number) =>
  arr[seed % arr.length];

const Particle = ({ delay, duration, x, y, size, color }: { delay: number; duration: number; x: string; y: string; size: number; color: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0],
      y: [0, -100, -200, -300],
    }}
    transition={{ 
      duration,
      delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
    className={twMerge("absolute rounded-full blur-[1px]", color)}
    style={{ 
      left: x, 
      top: y, 
      width: size, 
      height: size,
    }}
  />
);

const DrawingPath = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    style={{ filter: "blur(0.5px)" }}
    viewBox="0 0 1200 800"   // 👈 larger canvas
    preserveAspectRatio="none"
  >
    <motion.path
      d="M 50 200 Q 300 50 550 200 T 850 200 T 1150 200"
      fill="none"
      stroke="url(#gradient1)"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: [0, 0.6, 0.6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />

    <motion.path
      d="M 100 450 Q 350 250 600 450 T 900 450 T 1150 450"
      fill="none"
      stroke="url(#gradient2)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: [0, 0.5, 0.5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
    />

    <defs>
      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="50%" stopColor="hsl(var(--user-purple))" />
        <stop offset="100%" stopColor="hsl(var(--user-pink))" />
      </linearGradient>

      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(var(--user-cyan))" />
        <stop offset="100%" stopColor="hsl(var(--user-green))" />
      </linearGradient>
    </defs>
  </svg>
);


const Index = () => {
  // const [roomId, setRoomId] = useState('');
  // const [inputRoomId, setInputRoomId] = useState('');
  // const [isJoining, setIsJoining] = useState(false);
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   const handleMouseMove = (e: MouseEvent) => {
  //     setMousePosition({ x: e.clientX, y: e.clientY });
  //   };
  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // }, []);

  // const generateRoomId = () => {
  //   const id = Math.random().toString(36).substring(2, 8).toUpperCase();
  //   setRoomId(id);
  // };

  // const joinRoom = () => {
  //   if (inputRoomId.trim()) {
  //     setRoomId(inputRoomId.trim().toUpperCase());
  //   }
  // };

  // if (roomId) {
  //   return <CollaborativeCanvas roomId={roomId} />;
  // }

  const {data: session} = useSession()

  const features = [
    { icon: Pencil, label: 'Draw & Erase', desc: 'Intuitive brush tools', color: '--user-blue' },
    { icon: Users, label: 'Multi-User', desc: 'Collaborate together', color: '--user-green' },
    { icon: Zap, label: 'Real-Time', desc: 'Instant sync', color: '--user-amber' },
    { icon: MousePointer2, label: 'Live Cursors', desc: 'See others draw', color: '--user-purple' },
    { icon: Palette, label: 'Rich Colors', desc: 'Express yourself', color: '--user-pink' },
    { icon: Sparkles, label: 'Undo/Redo', desc: 'Never lose work', color: '--user-cyan' },
  ];

const particles = [
  // original 8 (unchanged except Tailwind colors)
  { delay: 0,   duration: 8,  x: '10%', y: '80%', size: 8, color: 'bg-blue-500' },
  { delay: 1,   duration: 10, x: '20%', y: '90%', size: 6, color: 'bg-purple-500' },
  { delay: 2,   duration: 9,  x: '80%', y: '85%', size: 7, color: 'bg-pink-500' },
  { delay: 3,   duration: 11, x: '90%', y: '75%', size: 6, color: 'bg-cyan-500' },
  { delay: 0.5, duration: 8,  x: '30%', y: '95%', size: 8, color: 'bg-indigo-500' },
  { delay: 1.5, duration: 9,  x: '70%', y: '88%', size: 7, color: 'bg-green-500' },
  { delay: 2.5, duration: 10, x: '50%', y: '92%', size: 6, color: 'bg-amber-500' },
  { delay: 3.5, duration: 8,  x: '60%', y: '80%', size: 8, color: 'bg-violet-500' },

  // additional 8
  { delay: 0.8, duration: 9,  x: '15%', y: '70%', size: 7, color: 'bg-sky-500' },
  { delay: 1.2, duration: 11, x: '25%', y: '85%', size: 6, color: 'bg-rose-500' },
  { delay: 1.8, duration: 8,  x: '40%', y: '78%', size: 8, color: 'bg-emerald-500' },
  { delay: 2.2, duration: 10, x: '55%', y: '90%', size: 7, color: 'bg-teal-500' },
  { delay: 2.8, duration: 9,  x: '65%', y: '75%', size: 6, color: 'bg-orange-500' },
  { delay: 3.2, duration: 11, x: '75%', y: '95%', size: 8, color: 'bg-fuchsia-500' },
  { delay: 3.8, duration: 8,  x: '85%', y: '82%', size: 7, color: 'bg-lime-500' },
  { delay: 4.2, duration: 10, x: '95%', y: '88%', size: 6, color: 'bg-red-500' },
];


  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Mouse follow glow */}
      <motion.div
        className="pointer-events-none fixed w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)',
          // x: mousePosition.x - 300,
          // y: mousePosition.y - 300,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs with more movement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 100, y: -100 }}
          animate={{ 
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/30 via-[hsl(var(--user-indigo))]/20 to-transparent blur-[80px]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-60 -left-60 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[hsl(var(--user-purple))]/30 via-[hsl(var(--user-pink))]/20 to-transparent blur-[100px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[hsl(var(--user-cyan))]/20 to-[hsl(var(--user-green))]/10 blur-[60px]"
        />

        {/* Drawing paths animation */}
        <DrawingPath />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
        
        {/* Floating geometric shapes with rotation */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[12%] w-20 h-20 rounded-3xl bg-gradient-to-br from-[hsl(var(--user-cyan))]/40 to-[hsl(var(--user-blue))]/20 backdrop-blur-md border border-white/20 shadow-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 25, 0],
            rotate: [0, -90, -180],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[30%] right-[15%] w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--user-orange))]/40 to-[hsl(var(--user-amber))]/20 backdrop-blur-md border border-white/20 shadow-xl"
        />
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [45, 135, 45],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[35%] left-[20%] w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(var(--user-green))]/40 to-[hsl(var(--user-teal))]/20 backdrop-blur-md border border-white/20 shadow-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 35, 0],
            rotate: [0, 270, 360],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[25%] right-[18%] w-12 h-12 rounded-full bg-linear-to-br from-[hsl(var(--user-purple))]/40 to-[hsl(var(--user-pink))]/20 backdrop-blur-md border border-white/20 shadow-xl"
        />

        {/* Sparkle stars */}
        {[...Array(15)].map((_, i) => {

        const color = pick(STAR_COLORS, i * 13);
          
         return <motion.div
            key={`star-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
            className="absolute"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            <Star className={twMerge("w-7 h-7", color)} />
          </motion.div>
    })}
        
        {/* Grid pattern with subtle animation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#dee1f5_1px,transparent_1px),linear-gradient(to_bottom,#dee1f5_1px,transparent_1px)] bg-size-[60px_60px]" 
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full"
        >
          {/* Header */}
          <div className="text-center mb-12">
            {/* Animated logo */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
              className="relative inline-flex items-center justify-center mb-8"
            >
              {/* Glow rings */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-24 h-24 rounded-full bg-primary/30 blur-xl"
              />
              <motion.div
                animate={{ scale: [1.1, 1.4, 1.1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute w-28 h-28 rounded-full bg-[hsl(var(--user-purple))]/20 blur-xl"
              />
              <div className="relative w-24 h-24 bg-linear-to-br from-blue-500 via-indigo-400 to-purple-400 rounded-[28px] shadow-2xl shadow-primary/40 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 7, -7, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Pencil className="w-12 h-12 text-white drop-shadow-lg" />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-5 py-2 bg-linear-to-r from-blue-200 to-[hsl(var(--user-purple))]/30 rounded-full text-blue-400 text-lg font-semibold mb-6 border border-blue-300 shadow-lg shadow-primary/10 cursor-default"
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.span>
                Real-time collaboration
              </motion.span>
            </motion.div>
            
            {/* Title with letter animation */}
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="block text-foreground"
              >
                Collaborative
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="block mt-2 bg-linear-to-r from-primary via-[hsl(var(--user-indigo))] to-[hsl(var(--user-purple))] bg-clip-text text-transparent bg-[length:200%_auto]"
                style={{
                  animation: 'gradient-shift 4s ease infinite',
                }}
              >
                Canvas
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-2xl text-gray-600 max-w-lg mx-auto leading-relaxed"
            >
              Draw together in real-time with anyone, anywhere. 
              <span className="text-black font-semibold"> Share ideas visually.</span>
            </motion.p>
          </div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-12"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.9 + i * 0.08,
                  ease: 'easeInOut'
                }}
                whileHover={{ 
                  scale: 1.08, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                className="group relative text-center p-4 rounded-2xl bg-white backdrop-blur-lg border border-transparent hover:border-blue-400 hover:bg-white/20 transition-colors duration-300 cursor-default overflow-hidden"
              >
                {/* Hover glow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent"
                />
                <div 
                  className="relative inline-flex items-center justify-center w-15 h-15 rounded-xl mb-3 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(${feature.color}) / 0.2), hsl(var(${feature.color}) / 0.1))`,
                  }}
                >
                  <feature.icon 
                    className="w-7 h-7 transition-all duration-300"
                    style={{ color: `hsl(var(${feature.color}))` }}
                  />
                </div>
                <p className="text-lg font-semibold text-foreground">{feature.label}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="relative bg-[#f6f8fb] backdrop-blur-xl rounded-2xl border border-gray-300 p-8 shadow-2xl shadow-black/10 overflow-hidden"
          >
            {/* Card background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-[hsl(var(--user-purple))]/10 to-transparent rounded-full blur-3xl" />

            <div className="relative space-y-5">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px hsl(var(--primary) / 0.4)' }}
                whileTap={{ scale: 0.98 }}
                // onClick={generateRoomId}
                className="w-full relative bg-linear-to-r from-blue-300 via-[hsl(var(--user-indigo))] to-[hsl(var(--user-purple))] text-white py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-primary/30 overflow-hidden group cursor-pointer"
              >
                {/* Shimmer effect */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent skew-x-12"
                />

                <span className="relative z-10 flex items-center justify-center gap-3">
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-6 h-6 fill-amber-400 text-amber-400" />
                  </motion.span>
                  Create New Room
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center z-100">
                  <span className="px-6 bg-white text-lg text-gray-600 font-medium">
                    or join existing room
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* {isJoining ? (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-3"
                  >
                    <input
                      type="text"
                      value={inputRoomId}
                      onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                      placeholder="ROOM ID"
                      className="flex-1 px-6 py-5 bg-secondary/60 border border-border/60 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-center text-xl tracking-[0.3em] uppercase transition-all duration-200"
                      maxLength={6}
                      autoFocus
                      // onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      // onClick={joinRoom}
                      // disabled={!inputRoomId.trim()}
                      className="px-6 py-5 bg-foreground text-background rounded-2xl font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    // onClick={() => setIsJoining(true)}
                    className="w-full bg-secondary/80 hover:bg-secondary text-secondary-foreground py-5 px-8 rounded-2xl font-semibold text-lg transition-all duration-200 border border-border/50 hover:border-border"
                  >
                    Join a Room
                  </motion.button>
                )} */}
              </AnimatePresence>

                  <motion.button
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    // onClick={() => setIsJoining(true)}
                    whileHover={{scale: 1.01, y: -7}}
                    className="w-full bg-[#E7E9EC] hover:bg-secondary text-secondary-foreground py-5 px-8 rounded-2xl font-semibold text-lg transition-all duration-200 border border-transparent hover:border-gray-300 cursor-pointer"
                  >
                    Join a Room
                  </motion.button>
            </div>
          </motion.div>
          

          {/* Footer hint */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="text-center text-lg font-semibold text-muted-foreground mt-8 flex items-center justify-center gap-2"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="w-7 h-7 text-blue-500" />
            </motion.span>
            Share your room ID with others to start collaborating
          </motion.p>
        </motion.div>
      </div>

      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
      `}</style>
    </div>
  );
};

export default Index;
