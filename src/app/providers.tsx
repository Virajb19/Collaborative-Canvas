"use client"

import { SessionProvider } from "next-auth/react";
import { Toaster as Sonner } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Providers({ children, ...props }: React.PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
         <SessionProvider>
              {children}
         </SessionProvider>
    </TooltipProvider>
  </QueryClientProvider>
}
