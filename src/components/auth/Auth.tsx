"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, LogIn, UserPlus } from "lucide-react"
import { FloatingParticles } from "~/components/FloatingParticles"
import { SignUpForm } from "./SignUp"
import { SignInForm } from "./SignIn"
import { useAuthStore } from "~/lib/store"

const Auth = ({isAuthenticated}: {isAuthenticated: boolean}) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const { isSignUp, toggleAuthMode } = useAuthStore()

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)

    }, [])

    return (
        <div className="min-h-screen bg-background overflow-hidden relative flex items-center justify-center p-4">
            {/* Mouse follow glow */}
            <motion.div
                className="fixed pointer-events-none z-0"
                animate={{
                    x: mousePosition.x - 200,
                    y: mousePosition.y - 200,
                }}
                transition={{ type: "spring", damping: 30, stiffness: 200 }}
            >
                <div className="w-[400px] h-[400px] bg-gradient-radial from-[hsl(var(--user-purple)/0.15)] to-transparent rounded-full blur-3xl" />
            </motion.div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[hsl(var(--user-purple)/0.3)] to-[hsl(var(--user-pink)/0.2)] rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[hsl(var(--user-cyan)/0.3)] to-[hsl(var(--user-blue)/0.2)] rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Floating particles */}
            <FloatingParticles />

            {/* Sparkle stars */}
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[hsl(var(--user-yellow))] rounded-full"
                    style={{
                        left: `${15 + i * 15}%`,
                        top: `${20 + (i % 3) * 25}%`,
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 2 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.4,
                    }}
                />
            ))}

            {/* Main card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-lg"
            >
                <div className="relative backdrop-blur-xl bg-card/40 border border-border/50 rounded-3xl p-10 shadow-2xl overflow-hidden">
                    {/* Card decorations */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--user-purple))] via-[hsl(var(--user-pink))] to-[hsl(var(--user-cyan))]" />
                    <motion.div
                        className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[hsl(var(--user-purple)/0.2)] to-transparent rounded-full blur-2xl"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-[hsl(var(--user-cyan)/0.2)] to-transparent rounded-full blur-2xl"
                        animate={{ scale: [1.3, 1, 1.3] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    />

                    {/* Header */}
                    <div className="text-center mb-10 relative">
                        <motion.div
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--user-purple))] to-[hsl(var(--user-pink))] mb-6 shadow-lg"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {isSignUp ? (
                                    <UserPlus className="w-10 h-10 text-white" />
                                ) : (
                                    <LogIn className="w-10 h-10 text-white" />
                                )}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="flex items-center justify-center gap-2 mb-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-5 h-5 text-[hsl(var(--user-yellow))]" />
                            </motion.div>
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                                Collaborative Canvas
                            </span>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={isSignUp ? "signup" : "signin"}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-4xl font-bold"
                            >
                                <span className="bg-gradient-to-r from-[hsl(var(--user-purple))] via-[hsl(var(--user-pink))] to-[hsl(var(--user-cyan))] bg-clip-text text-transparent">
                                    {isSignUp ? "Create Account" : "Welcome Back"}
                                </span>
                            </motion.h1>
                        </AnimatePresence>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-muted-foreground mt-3 text-base"
                        >
                            {isSignUp
                                ? "Join our creative community today"
                                : "Sign in to continue creating"}
                        </motion.p>
                    </div>

                    {/* Form */}
                    <AnimatePresence mode="wait">
                        {isSignUp ? <SignUpForm /> : <SignInForm />}
                    </AnimatePresence>

                    {/* Toggle */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-base text-muted-foreground">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button
                                type="button"
                                onClick={toggleAuthMode}
                                className="text-[hsl(var(--user-purple))] hover:text-[hsl(var(--user-pink))] font-medium transition-colors relative group"
                            >
                                {isSignUp ? "Sign In" : "Sign Up"}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[hsl(var(--user-purple))] to-[hsl(var(--user-pink))] group-hover:w-full transition-all duration-300" />
                            </button>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default Auth
