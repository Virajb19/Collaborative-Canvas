import { z } from 'zod'

export const SignUpSchema = z.object({
    username: z.string().min(3, {message: 'username must be atleast 3 letters long'}).max(25, {message: 'username cannot be more than 10 letters'}).trim(),
    email: z.string().email({message: 'Please enter a valid email'}).trim(),
    password: z.string().min(8, {message: 'Password must be atleast 8 letters long'}).max(15)
              .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, {message: 'Password must contain atleast one special char and one number'}).trim()
})  

export const SignInSchema = z.object({
    email: z.string().email({message: 'Please enter a valid email'}).trim(),
    password: z.string().min(8, {message: 'Password must be atleast 8 letters long'}).max(15, { message: 'Password cannot exceed 15 characters'})
              .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, {message: 'Password must contain atleast one special char and one number'}).trim()
})

export const createRoomSchema = z.object({ roomId: z.string().length(6, { message: 'Room ID must be 6 characters long'}).regex(/^[A-Z0-9]{6}$/), passcode: z.string().min(4, { message: 'Provide a passcode of atleast 4 characters'}).max(32, { message: 'Passcode cannot exceed 32 characters'}) });

export const joinRoomSchema = z.object({ roomId: z.string().length(6, { message: 'Room ID must be 6 characters long'}).regex(/^[A-Z0-9]{6}$/), passcode: z.string().min(4, { message: 'Provide a passcode of atleast 4 characters'}).max(32, { message: 'Passcode cannot exceed 32 characters'}) });
