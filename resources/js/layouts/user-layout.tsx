import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types';

interface UserLayoutProps {
    breadcrumbs?: BreadcrumbItem[];
    children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
        </div>
    );
}
