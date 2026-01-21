import { redirect } from "next/navigation";
import Auth from "~/components/auth/Auth";
import { auth } from "~/server/auth";

export default async function SignInPage() {

    const session = await auth()
    const isAuthenticated = !!session?.user

    if(isAuthenticated) {
        redirect('/')
    }

    return <Auth isAuthenticated={isAuthenticated}/>
}