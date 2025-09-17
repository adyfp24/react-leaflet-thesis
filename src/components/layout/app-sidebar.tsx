// app-sidebar.tsx
import { Link, NavLink, useLocation } from 'react-router-dom'
import { mainMenu } from '@/config/menu'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Settings, User, PlusCircle, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AppLogo } from './app-logo'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

export function AppSidebar() {
    const location = useLocation()
    
    return (
        <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-border bg-gradient-to-b from-background/80 to-muted/20 dark:from-gray-900/80 dark:to-gray-800/20 backdrop-blur-sm">
            {/* Logo */}
            <div className="p-4 border-b border-border/50">
                <Link to="/" className="flex items-center gap-2">
                    <AppLogo />
                </Link>
            </div>
            
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-1">
                    {mainMenu.map((item, index) => (
                        <div key={index} className="space-y-1">
                            {item.items && item.items.length > 0 ? (
                                <Collapsible
                                    defaultOpen={location.pathname.startsWith(item.url)}
                                    className="space-y-1"
                                >
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-between hover:bg-muted/50"
                                        >
                                            <div className="flex items-center gap-2">
                                                {item.icon && (
                                                    <item.icon className="h-4 w-4 text-muted-foreground" />
                                                )}
                                                <span className="font-medium">{item.title}</span>
                                            </div>
                                            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-1 pl-8">
                                        {item.items.map((subItem, subIndex) => (
                                            <NavLink
                                                key={subItem.title}
                                                to={subItem.url}
                                                className={({ isActive }) =>
                                                    cn(
                                                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted/50",
                                                        isActive ? "font-medium bg-muted text-foreground" : "text-muted-foreground"
                                                    )
                                                }
                                            >
                                                {subItem.icon ? (
                                                    <subItem.icon className="h-4 w-4" />
                                                ) : (
                                                    <div className="h-2 w-2 rounded-full bg-border" />
                                                )}
                                                <span>{subItem.title}</span>
                                            </NavLink>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>
                            ) : (
                                <NavLink
                                    to={item.url}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted/50",
                                            isActive ? "font-medium bg-muted text-foreground" : "text-muted-foreground"
                                        )
                                    }
                                >
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    <span className="font-medium">{item.title}</span>
                                </NavLink>
                            )}
                        </div>
                    ))}
                </div>
                
            </ScrollArea>
            
            {/* User profile */}
            <div className="p-4 border-t border-border/50 bg-gradient-to-t from-background/80 to-muted/20 dark:from-gray-900/80 dark:to-gray-800/20">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-primary-foreground">
                            AD
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">Super Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}