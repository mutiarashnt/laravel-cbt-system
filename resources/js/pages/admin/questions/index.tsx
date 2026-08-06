import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Edit2,
    Trash2,
    BookOpen,
    FolderKanban,
    Search,
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
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

    const [selectedSubjectId, setSelectedSubjectId] = useState<
        number | 'all' | 'unassigned'
    >('all');
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
            if (item.subject_id) {
                return false;
            }
        } else if (selectedSubjectId !== 'all') {
            if (item.subject_id !== selectedSubjectId) {
                return false;
            }
        }

        // Search query filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const matchQuestion = item.question.toLowerCase().includes(query);
            const matchChoice = item.choices?.some((c) =>
                c.choice_text.toLowerCase().includes(query),
            );
            const matchSubject = item.subject?.name
                .toLowerCase()
                .includes(query);

            return matchQuestion || matchChoice || matchSubject;
        }

        return true;
    });

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Soal" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Bank Soal
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola koleksi soal ujian yang dikelompokkan
                            berdasarkan mata pelajaran.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/subjects"
                            className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-muted"
                        >
                            <FolderKanban className="h-4 w-4" />
                            Kelola Mata Pelajaran
                        </Link>
                        <Link
                            href="/admin/questions/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
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
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
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
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
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
                                onClick={() =>
                                    setSelectedSubjectId('unassigned')
                                }
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    selectedSubjectId === 'unassigned'
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
                                }`}
                            >
                                Tanpa Mata Pelajaran ({unassignedCount})
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari isi soal, pilihan jawaban..."
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border bg-card py-1.5 pr-4 pl-9 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden"
                            />
                        </div>

                        <div className="text-xs text-muted-foreground">
                            Menampilkan{' '}
                            <span className="font-semibold text-foreground">
                                {filteredQuestions.length}
                            </span>{' '}
                            soal
                        </div>
                    </div>
                </div>

                {/* Table Questions */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
                            <tr>
                                <th className="w-12 p-4 text-center">No</th>
                                <th className="w-40 p-4">Mata Pelajaran</th>
                                <th className="p-4">Soal</th>
                                <th className="w-32 p-4 text-center">
                                    Pilihan
                                </th>
                                <th className="w-28 p-4 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {filteredQuestions.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        <BookOpen className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                                        <p className="text-sm font-medium">
                                            Tidak ada soal yang ditemukan
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {searchQuery
                                                ? 'Coba gunakan kata kunci pencarian lain.'
                                                : 'Belum ada soal pada kategori mata pelajaran ini.'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredQuestions.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <td className="p-4 text-center font-medium text-muted-foreground">
                                            {index + 1}
                                        </td>

                                        <td className="p-4">
                                            {item.subject ? (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                                    <FolderKanban className="h-3 w-3" />
                                                    {item.subject.name}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                                                    Belum Diset
                                                </span>
                                            )}
                                        </td>

                                        <td className="space-y-1 p-4">
                                            <p className="line-clamp-2 text-sm font-medium text-foreground">
                                                {item.question}
                                            </p>
                                            {item.choices &&
                                                item.choices.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                        {item.choices.map(
                                                            (choice) => (
                                                                <span
                                                                    key={
                                                                        choice.id
                                                                    }
                                                                    className={`rounded border px-2 py-0.5 text-xs ${
                                                                        choice.is_correct
                                                                            ? 'border-green-300 bg-green-100 font-semibold text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300'
                                                                            : 'border-transparent bg-muted text-muted-foreground'
                                                                    }`}
                                                                >
                                                                    {
                                                                        choice.choice_text
                                                                    }
                                                                </span>
                                                            ),
                                                        )}
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
                                                    className="rounded-md p-1.5 text-blue-600 transition-colors hover:bg-muted"
                                                    title="Edit Soal"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        deleteQuestion(item.id)
                                                    }
                                                    className="rounded-md p-1.5 text-red-600 transition-colors hover:bg-muted"
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
