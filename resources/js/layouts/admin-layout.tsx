import { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow">
                <div className="p-6">
                    <h1 className="text-xl font-bold">
                        Admin Panel
                    </h1>
                </div>

                <nav className="px-4 space-y-2">
                    <a
                        href="/admin/dashboard"
                        className="block rounded px-4 py-2 hover:bg-gray-100"
                    >
                        Dashboard
                    </a>

                    <a
                        href="/admin/questions"
                        className="block rounded px-4 py-2 hover:bg-gray-100"
                    >
                        Bank Soal
                    </a>

                    <a
                        href="/admin/results"
                        className="block rounded px-4 py-2 hover:bg-gray-100"
                    >
                        Hasil Ujian
                    </a>
                </nav>
            </aside>

            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}