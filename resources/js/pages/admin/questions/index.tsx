import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, BookOpen, FolderKanban, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import type { Question, Subject } from '@/types/cbt';

interface Props {
    questions: Question[];
    subjects: Subject[];
}

export default function Index({ questions, subjects }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Bank Soal', href: '/admin/questions' },
    ];

    const [selectedSubjectId, setSelectedSubjectId] = useState<number | 'all' | 'unassigned'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const deleteQuestion = (id: number) => {
        if (confirm('Yakin ingin menghapus soal ini?')) {
            router.delete(`/admin/questions/${id}`);
        }
    };

    // Calculate unassigned questions count
    const unassignedCount = questions.filter((q) => !q.subject_id).length;

    // Filter questions based on active tab and search query
    const filteredQuestions = questions.filter((item) => {
        // Subject filter
        if (selectedSubjectId === 'unassigned') {
            if (item.subject_id) return false;
        } else if (selectedSubjectId !== 'all') {
            if (item.subject_id !== selectedSubjectId) return false;
        }

        // Search query filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const matchQuestion = item.question.toLowerCase().includes(query);
            const matchChoice = item.choices?.some((c) => c.choice_text.toLowerCase().includes(query));
            const matchSubject = item.subject?.name.toLowerCase().includes(query);
            return matchQuestion || matchChoice || matchSubject;
        }

        return true;
    });

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Soal" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Bank Soal</h1>
                        <p className="text-muted-foreground text-sm">
                            Kelola koleksi soal ujian yang dikelompokkan berdasarkan mata pelajaran.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/subjects"
                            className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3.5 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        >
                            <FolderKanban className="h-4 w-4" />
                            Kelola Mata Pelajaran
                        </Link>
                        <Link
                            href="/admin/questions/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:opacity-90 transition-opacity"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Soal
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs & Search */}
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 border-b pb-2">
                        <button
                            onClick={() => setSelectedSubjectId('all')}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                selectedSubjectId === 'all'
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <BookOpen className="h-3.5 w-3.5" />
                            Semua Soal ({questions.length})
                        </button>

                        {subjects.map((subject) => (
                            <button
                                key={subject.id}
                                onClick={() => setSelectedSubjectId(subject.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    selectedSubjectId === subject.id
                                        ? 'bg-primary text-primary-foreground shadow-xs'
                                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <FolderKanban className="h-3.5 w-3.5" />
                                {subject.name} ({subject.questions_count ?? 0})
                            </button>
                        ))}

                        {unassignedCount > 0 && (
                            <button
                                onClick={() => setSelectedSubjectId('unassigned')}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    selectedSubjectId === 'unassigned'
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-200'
                                }`}
                            >
                                Tanpa Mata Pelajaran ({unassignedCount})
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari isi soal, pilihan jawaban..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border bg-card focus:outline-hidden focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="text-xs text-muted-foreground">
                            Menampilkan <span className="font-semibold text-foreground">{filteredQuestions.length}</span> soal
                        </div>
                    </div>
                </div>

                {/* Table Questions */}
                <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase">
                            <tr>
                                <th className="p-4 w-12 text-center">No</th>
                                <th className="p-4 w-40">Mata Pelajaran</th>
                                <th className="p-4">Soal</th>
                                <th className="p-4 w-32 text-center">Pilihan</th>
                                <th className="p-4 w-28 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {filteredQuestions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                                        <p className="font-medium text-sm">Tidak ada soal yang ditemukan</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {searchQuery
                                                ? 'Coba gunakan kata kunci pencarian lain.'
                                                : 'Belum ada soal pada kategori mata pelajaran ini.'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredQuestions.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-4 text-center font-medium text-muted-foreground">
                                            {index + 1}
                                        </td>

                                        <td className="p-4">
                                            {item.subject ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                                                    <FolderKanban className="h-3 w-3" />
                                                    {item.subject.name}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                                                    Belum Diset
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-4 space-y-1">
                                            <p className="font-medium text-foreground text-sm line-clamp-2">
                                                {item.question}
                                            </p>
                                            {item.choices && item.choices.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {item.choices.map((choice) => (
                                                        <span
                                                            key={choice.id}
                                                            className={`text-xs px-2 py-0.5 rounded border ${
                                                                choice.is_correct
                                                                    ? 'bg-green-100 text-green-800 border-green-300 font-semibold dark:bg-green-950/50 dark:text-green-300 dark:border-green-800'
                                                                    : 'bg-muted text-muted-foreground border-transparent'
                                                            }`}
                                                        >
                                                            {choice.choice_text}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>

                                        <td className="p-4 text-center text-xs font-medium text-muted-foreground">
                                            {item.choices?.length ?? 0} Pilihan
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <Link
                                                    href={`/admin/questions/${item.id}/edit`}
                                                    className="p-1.5 rounded-md hover:bg-muted text-blue-600 transition-colors"
                                                    title="Edit Soal"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteQuestion(item.id)}
                                                    className="p-1.5 rounded-md hover:bg-muted text-red-600 transition-colors"
                                                    title="Hapus Soal"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}