import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "~/server/auth";

export default async function ProtectedLayout({children}: {children: ReactNode}) {
    const session = await auth()
    if(!session || !session.user) return redirect('/')
    return <>
       {children}
    </>
}