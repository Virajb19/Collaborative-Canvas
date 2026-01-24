"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { toast } from "sonner"
import { SignUpSchema } from "~/lib/zod"
import { signIn } from "next-auth/react"
import { api } from "~/trpc/react"
import { useAuthStore } from "~/lib/store"
import { useRouter } from 'nextjs-toploader/app'

type SignUpValues = z.infer<typeof SignUpSchema>

export const SignUpForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { setIsSignUp } = useAuthStore()

    const router = useRouter()

    const signUpForm = useForm<SignUpValues>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: { username: "", email: "", password: "" },
    })

    const signup = api.user.signup.useMutation()

    const onSignUp = async (data: SignUpValues) => {
        await signup.mutateAsync(data, {
            onSuccess: async () => {
                signUpForm.reset()
                toast.success('Account created! Welcome 🎉', { position: 'top-center' })
                // setIsSignUp(false)

                const res = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                })

                if (res?.error || !res?.ok) {
                    toast.error("Account created, but auto login failed. Please sign in.")
                    setIsSignUp(false)
                    return
                }

                router.push('/')
            },
            onError: (err) => {
                console.error(err)
                toast.error(err.message)
            }
        })
    }

    return (
        <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-6">
                    <FormField
                        control={signUpForm.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground/80 text-base">Full Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            placeholder="John Doe"
                                            className="h-12 pl-12 bg-background/50 border-border/50 focus:border-[hsl(var(--user-purple))] transition-colors text-base"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground/80 text-base">Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            className="h-12 pl-12 bg-background/50 border-border/50 focus:border-[hsl(var(--user-purple))] transition-colors text-base"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground/80 text-base">Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="h-12 pl-12 pr-12 bg-background/50 border-border/50 focus:border-[hsl(var(--user-purple))] transition-colors text-base"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="submit"
                            disabled={signUpForm.formState.isSubmitting}
                            className="w-full h-14 bg-gradient-to-r from-[hsl(var(--user-purple))] to-[hsl(var(--user-pink))] hover:opacity-90 text-white font-medium rounded-xl relative overflow-hidden group text-lg disabled:cursor-not-allowed"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                                animate={{ x: ["100%", "-100%"] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            />
                            <span className="relative flex items-center justify-center gap-2 disabled:cursor-not-allowed">
                                {signUpForm.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="w-7 h-7 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </Button>
                    </motion.div>
                </form>
            </Form>
        </motion.div>
    )
}

export default SignUpForm
