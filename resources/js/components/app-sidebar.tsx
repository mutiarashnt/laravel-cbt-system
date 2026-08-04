import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, ClipboardList, BarChart3, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
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
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Bank Soal',
        href: '/admin/questions',
        icon: BookOpen,
    },
    {
        title: 'Ujian',
        href: '/admin/exams',
        icon: ClipboardList,
    },
    {
        title: 'Hasil',
        href: '/admin/results',
        icon: BarChart3,
    },
    {
        title: 'User',
        href: '/admin/users',
        icon: Users,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                {/* <AppLogo /> */}
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg">CBT Admin</span>
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {footerNavItems.length > 0 && (
                    <NavFooter items={footerNavItems} className="mt-auto" />
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
