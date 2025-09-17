// app-header.tsx
import { Link } from 'react-router-dom'
import { AppLogo } from './app-logo'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Search, Bell, Settings, User, Menu } from 'lucide-react'
import { ModeToggle } from '../custom/mode-toggle'

export function AppHeader() {
    return (
        <header className="bg-background/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="w-full max-w-7xl mx-auto flex items-center h-16 px-6">
                <div className="flex items-center gap-4 md:hidden">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Menu className="h-4 w-4" />
                    </Button>
                    <Link to="/" className="flex items-center">
                        <AppLogo />
                    </Link>
                </div>
                
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 w-[200px] lg:w-[300px]"
                        />
                    </div>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bell className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                    </Button>
                    
                    <ModeToggle />
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <User className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    )
}