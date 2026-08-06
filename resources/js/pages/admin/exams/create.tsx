import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, CheckSquare, FolderKanban, Filter } from 'lucide-react';
import type { Question } from '@/types/cbt';
import { FormEvent, useState } from 'react';

interface Props {
    questions: Question[];
}

export default function Create({ questions }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Kelola Ujian', href: '/admin/exams' },
        { title: 'Tambah Ujian', href: '/admin/exams/create' },
    ];

    const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        duration: 60,
        status: 'draft' as 'draft' | 'published',
        question_ids: [] as number[],
    });

    // Unique subjects from questions list
    const subjectsMap = new Map<number, string>();
    questions.forEach((q) => {
        if (q.subject) {
            subjectsMap.set(q.subject.id, q.subject.name);
        }
    });

    const filteredQuestions = questions.filter((q) => {
        if (selectedSubjectFilter === 'all') return true;
        if (selectedSubjectFilter === 'unassigned') return !q.subject_id;
        return q.subject_id === Number(selectedSubjectFilter);
    });

    const handleQuestionToggle = (id: number) => {
        if (data.question_ids.includes(id)) {
            setData(
                'question_ids',
                data.question_ids.filter((qId) => qId !== id)
            );
        } else {
            setData('question_ids', [...data.question_ids, id]);
        }
    };

    const handleSelectAllFiltered = () => {
        const filteredIds = filteredQuestions.map((q) => q.id);
        const allFilteredSelected = filteredIds.every((id) => data.question_ids.includes(id));

        if (allFilteredSelected) {
            setData(
                'question_ids',
                data.question_ids.filter((id) => !filteredIds.includes(id))
            );
        } else {
            const newSelected = Array.from(new Set([...data.question_ids, ...filteredIds]));
            setData('question_ids', newSelected);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/exams');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Ujian Baru" />

            <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tambah Ujian Baru</h1>
                        <p className="text-muted-foreground text-sm">
                            Isi detail ujian dan pilih soal yang ingin disertakan.
                        </p>
                    </div>

                    <Link
                        href="/admin/exams"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Judul Ujian *</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                                placeholder="Contoh: Ujian Tengah Semester Matematika"
                                required
                            />
                            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Deskripsi / Petunjuk</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                                placeholder="Tuliskan petunjuk pengerjaan ujian..."
                            />
                            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Durasi (Menit) *</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={data.duration}
                                    onChange={(e) => setData('duration', parseInt(e.target.value) || 1)}
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                                    required
                                />
                                {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Status Ujian *</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as 'draft' | 'published')}
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary bg-card"
                                >
                                    <option value="draft">Draft (Belum dapat diakses user)</option>
                                    <option value="published">Published (Dapat diakses user)</option>
                                </select>
                                {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                            <div>
                                <h2 className="text-lg font-bold">Pilih Soal ({data.question_ids.length} dipilih)</h2>
                                <p className="text-xs text-muted-foreground">
                                    Pilih soal dari bank soal untuk dimasukkan ke ujian ini.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Filter by Subject */}
                                <div className="flex items-center gap-1.5">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <select
                                        value={selectedSubjectFilter}
                                        onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                                        className="rounded-md border text-xs px-2.5 py-1.5 bg-card focus:outline-hidden focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="all">Semua Mata Pelajaran</option>
                                        {Array.from(subjectsMap.entries()).map(([id, name]) => (
                                            <option key={id} value={id.toString()}>
                                                {name}
                                            </option>
                                        ))}
                                        <option value="unassigned">Belum Ada Mata Pelajaran</option>
                                    </select>
                                </div>

                                {filteredQuestions.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleSelectAllFiltered}
                                        className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline"
                                    >
                                        <CheckSquare className="h-4 w-4" />
                                        Pilih Semua Tampil
                                    </button>
                                )}
                            </div>
                        </div>

                        {filteredQuestions.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-6 text-center">
                                Tidak ada soal pada filter mata pelajaran ini.
                            </p>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {filteredQuestions.map((question, index) => {
                                    const isSelected = data.question_ids.includes(question.id);
                                    return (
                                        <div
                                            key={question.id}
                                            onClick={() => handleQuestionToggle(question.id)}
                                            className={`p-4 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                                                isSelected ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {}}
                                                className="mt-1 rounded text-primary focus:ring-primary"
                                            />
                                            <div className="space-y-1 w-full">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-xs font-semibold text-muted-foreground">
                                                        Soal #{index + 1}
                                                    </span>
                                                    {question.subject ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
                                                            <FolderKanban className="h-3 w-3" />
                                                            {question.subject.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 font-medium">
                                                            Belum Diset
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium">{question.question}</p>
                                                {question.choices && question.choices.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-1">
                                                        {question.choices.map((c) => (
                                                            <span
                                                                key={c.id}
                                                                className={`text-xs px-2 py-0.5 rounded border ${
                                                                    c.is_correct
                                                                        ? 'bg-green-100 text-green-800 border-green-300 font-medium'
                                                                        : 'bg-muted text-muted-foreground'
                                                                }`}
                                                            >
                                                                {c.choice_text}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href="/admin/exams"
                            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Batal
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:opacity-90 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Ujian'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
