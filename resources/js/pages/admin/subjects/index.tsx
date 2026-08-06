import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Plus,
    Edit2,
    Trash2,
    BookOpen,
    FolderKanban,
    X,
    Check,
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import type { Subject } from '@/types/cbt';
import type { FormEvent } from 'react';

interface Props {
    subjects: Subject[];
}

export default function Index({ subjects }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Mata Pelajaran', href: '/admin/subjects' },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const { data, setData, post, put, reset, errors, processing } = useForm({
        name: '',
        code: '',
        description: '',
    });

    const openAddModal = () => {
        setEditingSubject(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (subject: Subject) => {
        setEditingSubject(subject);
        setData({
            name: subject.name,
            code: subject.code || '',
            description: subject.description || '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSubject(null);
        reset();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (editingSubject) {
            put(`/admin/subjects/${editingSubject.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/admin/subjects', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (
            confirm(
                'Yakin ingin menghapus mata pelajaran ini? Soal terkait akan dialihkan ke "Tanpa Mata Pelajaran".',
            )
        ) {
            router.delete(`/admin/subjects/${id}`);
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Mata Pelajaran" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Mata Pelajaran
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola daftar mata pelajaran (subject) untuk
                            mengelompokkan soal di bank soal.
                        </p>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Mata Pelajaran
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {subjects.length === 0 ? (
                        <div className="col-span-full rounded-xl border bg-card p-12 text-center text-muted-foreground">
                            <FolderKanban className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                            <p className="text-base font-medium">
                                Belum ada mata pelajaran
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Klik tombol di atas untuk menambahkan mata
                                pelajaran baru.
                            </p>
                        </div>
                    ) : (
                        subjects.map((subject) => (
                            <div
                                key={subject.id}
                                className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-colors hover:border-primary/50"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                                <FolderKanban className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold text-foreground">
                                                    {subject.name}
                                                </h3>
                                                {subject.code && (
                                                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-medium text-muted-foreground">
                                                        {subject.code}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {subject.description && (
                                        <p className="line-clamp-2 text-xs text-muted-foreground">
                                            {subject.description}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t pt-4">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <BookOpen className="h-3.5 w-3.5" />
                                        <span>
                                            {subject.questions_count ?? 0} Soal
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() =>
                                                openEditModal(subject)
                                            }
                                            className="rounded-md p-1.5 text-blue-600 transition-colors hover:bg-muted"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(subject.id)
                                            }
                                            className="rounded-md p-1.5 text-red-600 transition-colors hover:bg-muted"
                                            title="Hapus"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Tambah / Edit Mata Pelajaran */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md animate-in overflow-hidden rounded-xl border bg-card shadow-lg duration-200 zoom-in-95 fade-in">
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="text-lg font-semibold">
                                {editingSubject
                                    ? 'Edit Mata Pelajaran'
                                    : 'Tambah Mata Pelajaran'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 p-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Nama Mata Pelajaran *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Matematika, Fisika"
                                    value={data.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Kode Mata Pelajaran (Opsional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: MTK-01"
                                    value={data.code}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('code', e.target.value)}
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden"
                                />
                                {errors.code && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.code}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Deskripsi (Opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Keterangan mengenai mata pelajaran..."
                                    value={data.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 border-t pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:opacity-90 disabled:opacity-50"
                                >
                                    <Check className="h-4 w-4" />
                                    {editingSubject ? 'Perbarui' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
