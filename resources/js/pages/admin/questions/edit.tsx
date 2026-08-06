import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import type { Question, Subject } from '@/types/cbt';
import { FormEvent } from 'react';

interface Props {
    question: Question;
    subjects: Subject[];
}

export default function Edit({ question, subjects }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Bank Soal', href: '/admin/questions' },
        { title: `Edit Soal #${question.id}`, href: `/admin/questions/${question.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        subject_id: (question.subject_id ?? '') as string | number,
        question: question.question,
        type: question.type || 'multiple_choice',
        choices: question.choices ? question.choices.map((item) => item.choice_text) : ['', '', '', ''],
        correct_answer: question.choices ? question.choices.findIndex((item) => item.is_correct) : 0,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/questions/${question.id}`);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Soal #${question.id}`} />

            <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Soal</h1>
                        <p className="text-muted-foreground text-sm">
                            Perbarui detail soal dan mata pelajarannya.
                        </p>
                    </div>

                    <Link
                        href="/admin/questions"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-xl border bg-card p-6 shadow-xs space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Mata Pelajaran *
                            </label>
                            <select
                                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary bg-card"
                                value={data.subject_id}
                                onChange={(e) => setData('subject_id', e.target.value)}
                            >
                                <option value="">-- Pilih Mata Pelajaran --</option>
                                {subjects.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name} {sub.code ? `(${sub.code})` : ''}
                                    </option>
                                ))}
                            </select>
                            {errors.subject_id && (
                                <p className="text-xs text-red-500 mt-1">{errors.subject_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Pertanyaan / Teks Soal *
                            </label>
                            <textarea
                                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                                rows={4}
                                value={data.question}
                                onChange={(e) => setData('question', e.target.value)}
                                required
                            />
                            {errors.question && (
                                <p className="text-xs text-red-500 mt-1">{errors.question}</p>
                            )}
                        </div>

                        <div className="space-y-3 pt-2 border-t">
                            <label className="block text-sm font-semibold text-foreground">
                                Pilihan Jawaban (Tandai yang Benar) *
                            </label>

                            {data.choices.map((choice, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="correct_answer"
                                        checked={data.correct_answer === index}
                                        onChange={() => setData('correct_answer', index)}
                                        className="h-4 w-4 text-primary focus:ring-primary"
                                        title="Tandai sebagai jawaban benar"
                                    />
                                    <span className="text-xs font-semibold text-muted-foreground w-16">
                                        Pilihan {index + 1}
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                                        value={choice}
                                        onChange={(e) => {
                                            const newChoices = [...data.choices];
                                            newChoices[index] = e.target.value;
                                            setData('choices', newChoices);
                                        }}
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 border-t">
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Kunci Jawaban Benar
                            </label>
                            <select
                                className="w-full sm:w-64 rounded-md border px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary bg-card"
                                value={data.correct_answer}
                                onChange={(e) => setData('correct_answer', Number(e.target.value))}
                            >
                                {data.choices.map((_, index) => (
                                    <option key={index} value={index}>
                                        Pilihan {index + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href="/admin/questions"
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
                            {processing ? 'Menyimpan...' : 'Perbarui Soal'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}