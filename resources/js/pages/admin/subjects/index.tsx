import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, BookOpen, FolderKanban, X, Check } from 'lucide-react';
import { useState, FormEvent } from 'react';
import type { Subject } from '@/types/cbt';

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
        if (confirm('Yakin ingin menghapus mata pelajaran ini? Soal terkait akan dialihkan ke "Tanpa Mata Pelajaran".')) {
            router.delete(`/admin/subjects/${id}`);
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Mata Pelajaran" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Mata Pelajaran</h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola daftar mata pelajaran (subject) untuk mengelompokkan soal di bank soal.
                        </p>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:opacity-90 transition-opacity"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Mata Pelajaran
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.length === 0 ? (
                        <div className="col-span-full rounded-xl border bg-card p-12 text-center text-muted-foreground">
                            <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                            <p className="text-base font-medium">Belum ada mata pelajaran</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Klik tombol di atas untuk menambahkan mata pelajaran baru.
                            </p>
                        </div>
                    ) : (
                        subjects.map((subject) => (
                            <div
                                key={subject.id}
                                className="rounded-xl border bg-card p-5 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <FolderKanban className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground text-base">
                                                    {subject.name}
                                                </h3>
                                                {subject.code && (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-muted font-mono font-medium text-muted-foreground">
                                                        {subject.code}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {subject.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {subject.description}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-4 mt-4 border-t flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <BookOpen className="h-3.5 w-3.5" />
                                        <span>{subject.questions_count ?? 0} Soal</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => openEditModal(subject)}
                                            className="p-1.5 rounded-md hover:bg-muted text-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(subject.id)}
                                            className="p-1.5 rounded-md hover:bg-muted text-red-600 transition-colors"
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
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-md rounded-xl border shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="font-semibold text-lg">
                                {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-1 rounded-md hover:bg-muted text-muted-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nama Mata Pelajaran *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Matematika, Fisika"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Kode Mata Pelajaran (Opsional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: MTK-01"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                                />
                                {errors.code && (
                                    <p className="text-xs text-red-500 mt-1">{errors.code}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Deskripsi (Opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Keterangan mengenai mata pelajaran..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t">
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
