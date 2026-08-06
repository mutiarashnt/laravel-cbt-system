import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    CheckSquare,
    FolderKanban,
    Filter,
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import type { Exam, Question } from '@/types/cbt';
import type { FormEvent } from 'react';

interface Props {
    exam: Exam;
    questions: Question[];
    selectedQuestionIds: number[];
}

export default function Edit({ exam, questions, selectedQuestionIds }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Kelola Ujian', href: '/admin/exams' },
        { title: `Edit: ${exam.title}`, href: `/admin/exams/${exam.id}/edit` },
    ];

    const [selectedSubjectFilter, setSelectedSubjectFilter] =
        useState<string>('all');

    const { data, setData, put, processing, errors } = useForm({
        title: exam.title,
        description: exam.description || '',
        duration: exam.duration,
        status: exam.status,
        question_ids: selectedQuestionIds || [],
    });

    // Unique subjects from questions list
    const subjectsMap = new Map<number, string>();
    questions.forEach((q) => {
        if (q.subject) {
            subjectsMap.set(q.subject.id, q.subject.name);
        }
    });

    const filteredQuestions = questions.filter((q) => {
        if (selectedSubjectFilter === 'all') {
            return true;
        }

        if (selectedSubjectFilter === 'unassigned') {
            return !q.subject_id;
        }

        return q.subject_id === Number(selectedSubjectFilter);
    });

    const handleQuestionToggle = (id: number) => {
        if (data.question_ids.includes(id)) {
            setData(
                'question_ids',
                data.question_ids.filter((qId) => qId !== id),
            );
        } else {
            setData('question_ids', [...data.question_ids, id]);
        }
    };

    const handleSelectAllFiltered = () => {
        const filteredIds = filteredQuestions.map((q) => q.id);
        const allFilteredSelected = filteredIds.every((id) =>
            data.question_ids.includes(id),
        );

        if (allFilteredSelected) {
            setData(
                'question_ids',
                data.question_ids.filter((id) => !filteredIds.includes(id)),
            );
        } else {
            const newSelected = Array.from(
                new Set([...data.question_ids, ...filteredIds]),
            );
            setData('question_ids', newSelected);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/exams/${exam.id}`);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Ujian - ${exam.title}`} />

            <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Edit Ujian
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Perbarui detail ujian dan susunan soal.
                        </p>
                    </div>

                    <Link
                        href="/admin/exams"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4 rounded-xl border bg-card p-6 shadow-xs">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-foreground">
                                Judul Ujian *
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setData('title', e.target.value)}
                                className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden"
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-foreground">
                                Deskripsi / Petunjuk
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(
                                    e: React.ChangeEvent<
                                        | HTMLInputElement
                                        | HTMLSelectElement
                                        | HTMLTextAreaElement
                                    >,
                                ) => setData('description', e.target.value)}
                                rows={3}
                                className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden"
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">
                                    Durasi (Menit) *
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={data.duration}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setData(
                                            'duration',
                                            parseInt(e.target.value) || 1,
                                        )
                                    }
                                    className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden"
                                    required
                                />
                                {errors.duration && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.duration}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-foreground">
                                    Status Ujian *
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(
                                        e: React.ChangeEvent<
                                            | HTMLInputElement
                                            | HTMLSelectElement
                                            | HTMLTextAreaElement
                                        >,
                                    ) =>
                                        setData(
                                            'status',
                                            e.target.value as
                                                'draft' | 'published',
                                        )
                                    }
                                    className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden"
                                >
                                    <option value="draft">
                                        Draft (Belum dapat diakses user)
                                    </option>
                                    <option value="published">
                                        Published (Dapat diakses user)
                                    </option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.status}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-xl border bg-card p-6 shadow-xs">
                        <div className="flex flex-col justify-between gap-3 border-b pb-3 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Pilih Soal ({data.question_ids.length}{' '}
                                    dipilih)
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Pilih soal dari bank soal untuk dimasukkan
                                    ke ujian ini.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Filter by Subject */}
                                <div className="flex items-center gap-1.5">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <select
                                        value={selectedSubjectFilter}
                                        onChange={(
                                            e: React.ChangeEvent<
                                                | HTMLInputElement
                                                | HTMLSelectElement
                                                | HTMLTextAreaElement
                                            >,
                                        ) =>
                                            setSelectedSubjectFilter(
                                                e.target.value,
                                            )
                                        }
                                        className="rounded-md border bg-card px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
                                    >
                                        <option value="all">
                                            Semua Mata Pelajaran
                                        </option>
                                        {Array.from(subjectsMap.entries()).map(
                                            ([id, name]) => (
                                                <option
                                                    key={id}
                                                    value={id.toString()}
                                                >
                                                    {name}
                                                </option>
                                            ),
                                        )}
                                        <option value="unassigned">
                                            Belum Ada Mata Pelajaran
                                        </option>
                                    </select>
                                </div>

                                {filteredQuestions.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleSelectAllFiltered}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                                    >
                                        <CheckSquare className="h-4 w-4" />
                                        Pilih Semua Tampil
                                    </button>
                                )}
                            </div>
                        </div>

                        {filteredQuestions.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                Tidak ada soal pada filter mata pelajaran ini.
                            </p>
                        ) : (
                            <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
                                {filteredQuestions.map((question, index) => {
                                    const isSelected =
                                        data.question_ids.includes(question.id);

                                    return (
                                        <div
                                            key={question.id}
                                            onClick={() =>
                                                handleQuestionToggle(
                                                    question.id,
                                                )
                                            }
                                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                                                isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'hover:border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {}}
                                                className="mt-1 rounded text-primary focus:ring-primary"
                                            />
                                            <div className="w-full space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-xs font-semibold text-muted-foreground">
                                                        Soal #{index + 1}
                                                    </span>
                                                    {question.subject ? (
                                                        <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                            <FolderKanban className="h-3 w-3" />
                                                            {
                                                                question.subject
                                                                    .name
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                                                            Belum Diset
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium">
                                                    {question.question}
                                                </p>
                                                {question.choices &&
                                                    question.choices.length >
                                                        0 && (
                                                        <div className="flex flex-wrap gap-2 pt-1">
                                                            {question.choices.map(
                                                                (c) => (
                                                                    <span
                                                                        key={
                                                                            c.id
                                                                        }
                                                                        className={`rounded border px-2 py-0.5 text-xs ${
                                                                            c.is_correct
                                                                                ? 'border-green-300 bg-green-100 font-medium text-green-800'
                                                                                : 'bg-muted text-muted-foreground'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            c.choice_text
                                                                        }
                                                                    </span>
                                                                ),
                                                            )}
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
                            {processing ? 'Menyimpan...' : 'Perbarui Ujian'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
