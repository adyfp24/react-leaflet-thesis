// config/menu.ts
import { MenuItem } from "@/types/sidebar-menu"
import {
    Home,
    Settings,
    CreditCard,
    FileText,
    Users,
    List,
    Send,
    BarChart2,
    Layers,
    HelpCircle,
    Mail,
    MessageSquare,
    DollarSign,
    PieChart,
    AlertCircle,
    Search,
    ChartCandlestick,
    Banknote,
    History,
    ArrowLeftRight
} from "lucide-react"

export const mainMenu: MenuItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Transaksi",
        url: "/transactions",
        icon: CreditCard,
        items: [
            {
                title: "Cek Transaksi",
                url: "/transactions/list",
                icon: List
            },
            {
                title: "Rekap Transaksi",
                url: "/transactions/summary",
                icon: PieChart
            },
            {
                title: "Total Transaksi",
                url: "/transactions/total",
                icon: DollarSign
            }
        ],
    },
    {
        title: "Mutasi",
        url: "/mutasi",
        icon: Users,
        items: [
            {
                title: "Mutasi Deposit",
                url: "/downline/list",
                icon: History
            },
            {
                title: "Mutasi Transaksi",
                url: "/downline/mutations",
                icon: ArrowLeftRight
            },
            {
                title: "Rekap Transfer Saldo",
                url: "/downline/commissions",
                icon: Banknote
            },
        ],
    },
    {
        title: "Downline",
        url: "/downline",
        icon: Users,
        items: [
            {
                title: "List Downline",
                url: "/downline/list",
                icon: Users
            },
            {
                title: "Cek Transaksi Downline",
                url: "/downline/mutations",
                icon: Search
            },
            {
                title: "List Transaksi Downline",
                url: "/downline/commissions",
                icon: BarChart2
            },
            {
                title: "Total Transaksi Downline",
                url: "/downline/commissions",
                icon: ChartCandlestick
            },
            {
                title: "Rekap Komisi",
                url: "/downline/commissions",
                icon: DollarSign
            },

        ],
    },
    {
        title: "Pesan",
        url: "/messages",
        icon: Mail,
        items: [
            {
                title: "Inbox",
                url: "/messages/inbox",
                icon: Mail
            },
            {
                title: "outbox",
                url: "/messages/outbox",
                icon: Send
            },
        ],
    },
    {
        title: "Informasi",
        url: "/information",
        icon: AlertCircle,
        items: [
            {
                title: "Daftar Harga",
                url: "/information/pricelist",
                icon: FileText
            },
        ],
    },
]