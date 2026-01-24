import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(time: number) {
   return new Promise((resolve) => setTimeout(resolve, time * 1000))
}
