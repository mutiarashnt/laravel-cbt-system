import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid, ClipboardList, PenTool, FolderKanban } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, SharedData } from '@/types';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Mata Pelajaran',
        href: '/admin/subjects',
        icon: FolderKanban,
    },
    {
        title: 'Bank Soal',
        href: '/admin/questions',
        icon: BookOpen,
    },
    {
        title: 'Kelola Ujian',
        href: '/admin/exams',
        icon: ClipboardList,
    },
];

const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/user/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Daftar Ujian',
        href: '/user/exams',
        icon: PenTool,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'admin';
    const navItems = isAdmin ? adminNavItems : userNavItems;
    const dashboardUrl = isAdmin ? '/admin/dashboard' : '/user/dashboard';
    const appTitle = isAdmin ? 'CBT Admin' : 'CBT Peserta';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg">{appTitle}</span>
                                    <span className="text-xs text-gray-500">
                                        Sistem Ujian Online
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
