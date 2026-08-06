import type { BreadcrumbItem } from '@/types';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
    breadcrumbs?: BreadcrumbItem[];
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
        </div>
    );
}