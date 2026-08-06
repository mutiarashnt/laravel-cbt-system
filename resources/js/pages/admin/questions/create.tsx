import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import type { Subject } from '@/types/cbt';

interface Props {
    subjects: Subject[];
}

export default function Create({ subjects }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Bank Soal', href: '/admin/questions' },
        { title: 'Tambah Soal', href: '/admin/questions/create' },
    ];

    const form = useForm({
        subject_id: '' as string | number,
        question: '',
        type: 'multiple_choice',
        choices: ['', '', '', ''],
        correct_answer: 0,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post('/admin/questions');
    }

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Soal Baru" />

            <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Tambah Soal Baru
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Buat soal baru dan tentukan kelompok mata
                            pelajarannya.
                        </p>
                    </div>

                    <Link
                        href="/admin/questions"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-5 rounded-xl border bg-card p-6 shadow-xs">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-foreground">
                                Mata Pelajaran *
                            </label>
                            <select
                                className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden"
                                value={form.data.subject_id}
                                onChange={(e) =>
                                    form.setData('subject_id', e.target.value)
                                }
                            >
                                <option value="">
                                    -- Pilih Mata Pelajaran --
                                </option>
                                {subjects.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}{' '}
                                        {sub.code ? `(${sub.code})` : ''}
                                    </option>
                                ))}
                            </select>
                            {form.errors.subject_id && (
                                <p className="mt-1 text-xs text-red-500">
                                    {form.errors.subject_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-foreground">
                                Pertanyaan / Teks Soal *
                            </label>
                            <textarea
                                className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden"
                                rows={4}
                                placeholder="Masukkan isi pertanyaan di sini..."
                                value={form.data.question}
                                onChange={(e) =>
                                    form.setData('question', e.target.value)
                                }
                                required
                            />
                            {form.errors.question && (
                                <p className="mt-1 text-xs text-red-500">
                                    {form.errors.question}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 border-t pt-2">
                            <label className="block text-sm font-semibold text-foreground">
                                Pilihan Jawaban *
                            </label>

                            {form.data.choices.map((choice, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <span className="w-20 text-xs font-semibold text-muted-foreground">
                                        Pilihan {index + 1}
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden"
                                        placeholder={`Teks pilihan ${index + 1}`}
                                        value={choice}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const choices = [...form.data.choices];
                                            choices[index] = e.target.value;
                                            form.setData('choices', choices);
                                        }}
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-2">
                            <label className="mb-1 block text-sm font-medium text-foreground">
                                Kunci Jawaban Benar *
                            </label>
                            <select
                                className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden sm:w-64"
                                value={form.data.correct_answer}
                                onChange={(e) =>
                                    form.setData(
                                        'correct_answer',
                                        Number(e.target.value),
                                    )
                                }
                            >
                                {form.data.choices.map((_, index) => (
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
                            disabled={form.processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:opacity-90 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {form.processing ? 'Menyimpan...' : 'Simpan Soal'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
