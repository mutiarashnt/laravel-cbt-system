import { Head, Link } from '@inertiajs/react';
import { BookOpen, ClipboardList, Users, UserCheck, Plus } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import type { Exam } from '@/types';

interface Stats {
    total_questions: number;
    total_exams: number;
    total_participants: number;
    total_users: number;
}

interface Props {
    stats: Stats;
    recentExams: Exam[];
}

export default function Dashboard({ stats, recentExams }: Props) {
    const breadcrumbs = [{ title: 'Dashboard', href: '/admin/dashboard' }];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard Admin
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Selamat datang di Panel Manajemen CBT Online.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between space-y-0">
                            <span className="text-sm font-medium">
                                Total Soal
                            </span>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                            {stats.total_questions}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between space-y-0">
                            <span className="text-sm font-medium">
                                Total Ujian
                            </span>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                            {stats.total_exams}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between space-y-0">
                            <span className="text-sm font-medium">
                                Total Pendaftaran
                            </span>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                            {stats.total_participants}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between space-y-0">
                            <span className="text-sm font-medium">
                                Total Peserta
                            </span>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                            {stats.total_users}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 rounded-xl border bg-card p-6 shadow-xs">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Ujian Terbaru</h2>
                        <Link
                            href="/admin/exams/create"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                        >
                            <Plus className="h-4 w-4" />
                            Buat Ujian
                        </Link>
                    </div>

                    {recentExams.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            Belum ada ujian yang dibuat.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-muted/50 text-xs text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-4 py-3">
                                            Judul Ujian
                                        </th>
                                        <th className="px-4 py-3">Durasi</th>
                                        <th className="px-4 py-3">
                                            Jumlah Soal
                                        </th>
                                        <th className="px-4 py-3">Peserta</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentExams.map((exam) => (
                                        <tr
                                            key={exam.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {exam.title}
                                            </td>
                                            <td className="px-4 py-3">
                                                {exam.duration} menit
                                            </td>
                                            <td className="px-4 py-3">
                                                {exam.questions_count ?? 0} Soal
                                            </td>
                                            <td className="px-4 py-3">
                                                {exam.participants_count ?? 0}{' '}
                                                Peserta
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        exam.status ===
                                                        'published'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {exam.status === 'published'
                                                        ? 'Dipublikasikan'
                                                        : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/admin/exams/${exam.id}`}
                                                    className="text-xs font-medium text-blue-600 hover:underline"
                                                >
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
