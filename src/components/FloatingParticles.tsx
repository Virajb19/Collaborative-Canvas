"use client"

import { motion } from "framer-motion"

interface FloatingParticleProps {
    delay: number
    duration: number
    x: number
    size: number
}

const FloatingParticle = ({ delay, duration, x, size }: FloatingParticleProps) => (
    <motion.div
        className="absolute rounded-full bg-gradient-to-r from-[hsl(var(--user-purple))] to-[hsl(var(--user-pink))] opacity-20"
        style={{ width: size, height: size, left: `${x}%` }}
        initial={{ y: "100vh", opacity: 0 }}
        animate={{
            y: "-100vh",
            opacity: [0, 0.3, 0.3, 0],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "linear"
        }}
    />
)

export const FloatingParticles = () => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
        delay: i * 0.8,
        duration: 12 + Math.random() * 8,
        x: Math.random() * 100,
        size: 4 + Math.random() * 8,
    }))

    return (
        <>
            {particles.map((particle, i) => (
                <FloatingParticle key={i} {...particle} />
            ))}
        </>
    )
}

export default FloatingParticles
