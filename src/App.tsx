import { BrowserRouter, HashRouter } from 'react-router'
import { ThemeProvider } from './contexts/ThemeContext'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import Router from './Router';

const AppRouter = import.meta.env.VITE_USE_HASH_ROUTE === 'true' ? HashRouter : BrowserRouter

export default function App() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <AppRouter>
                    <Router />
                </AppRouter>
            </QueryClientProvider>
        </ThemeProvider>
    )
}
