export interface MenuItem {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
    items?: SubMenuItem[];
}

export interface SubMenuItem {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
}
