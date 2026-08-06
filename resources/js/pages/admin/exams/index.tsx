import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2, Edit, Eye, Clock, HelpCircle, Users } from 'lucide-react';
import type { Exam } from '@/types';

interface Props {
    exams: Exam[];
}

export default function Index({ exams }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Kelola Ujian', href: '/admin/exams' },
    ];

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ujian "${title}"?`)) {
            router.delete(`/admin/exams/${id}`);
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Ujian" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Kelola Ujian</h1>
                        <p className="text-muted-foreground text-sm">
                            Daftar ujian online yang telah dibuat.
                        </p>
                    </div>

                    <Link
                        href="/admin/exams/create"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:opacity-90 transition-opacity"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Ujian Baru
                    </Link>
                </div>

                {exams.length === 0 ? (
                    <div className="rounded-xl border bg-card p-12 text-center shadow-xs">
                        <p className="text-muted-foreground text-sm">Belum ada ujian. Silakan buat ujian pertama Anda.</p>
                        <Link
                            href="/admin/exams/create"
                            className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
                        >
                            <Plus className="h-4 w-4" />
                            Buat Ujian
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {exams.map((exam) => (
                            <div
                                key={exam.id}
                                className="rounded-xl border bg-card p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-primary/50 transition-colors"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                exam.status === 'published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {exam.status === 'published' ? 'Dipublikasikan' : 'Draft'}
                                        </span>
                                    </div>

                                    <h2 className="text-lg font-bold line-clamp-1">{exam.title}</h2>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {exam.description || 'Tidak ada deskripsi.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{exam.duration}m</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <HelpCircle className="h-3.5 w-3.5" />
                                        <span>{exam.questions_count ?? 0} Soal</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>{exam.participants_count ?? 0} User</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t">
                                    <Link
                                        href={`/admin/exams/${exam.id}`}
                                        className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        Detail
                                    </Link>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/exams/${exam.id}/edit`}
                                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                                            title="Edit Ujian"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(exam.id, exam.title)}
                                            className="p-1.5 rounded-md hover:bg-red-50 text-red-500"
                                            title="Hapus Ujian"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
