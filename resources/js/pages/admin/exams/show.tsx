import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock, Edit, BookOpen, Users } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import type { Exam, Participant } from '@/types/cbt';

interface ExtendedParticipant extends Participant {
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    exam: Exam & {
        participants?: ExtendedParticipant[];
    };
}

export default function Show({ exam }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Kelola Ujian', href: '/admin/exams' },
        { title: exam.title, href: `/admin/exams/${exam.id}` },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Ujian - ${exam.title}`} />

            <div className="max-w-5xl space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {exam.title}
                            </h1>
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    exam.status === 'published'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                                {exam.status === 'published'
                                    ? 'Dipublikasikan'
                                    : 'Draft'}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {exam.description || 'Tidak ada deskripsi.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/admin/exams/${exam.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Ujian
                        </Link>
                        <Link
                            href="/admin/exams"
                            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
                        <Clock className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Durasi Pengerjaan
                            </p>
                            <p className="text-lg font-bold">
                                {exam.duration} Menit
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Jumlah Soal
                            </p>
                            <p className="text-lg font-bold">
                                {exam.questions?.length ?? 0} Soal
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
                        <Users className="h-8 w-8 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Total Peserta Terdaftar
                            </p>
                            <p className="text-lg font-bold">
                                {exam.participants?.length ?? 0} Peserta
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section Soal Ujian */}
                <div className="space-y-4 rounded-xl border bg-card p-6 shadow-xs">
                    <h2 className="text-lg font-bold">
                        Daftar Soal Ujian ({exam.questions?.length ?? 0})
                    </h2>

                    {!exam.questions || exam.questions.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            Belum ada soal yang terhubung ke ujian ini.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {exam.questions.map((question, index) => (
                                <div
                                    key={question.id}
                                    className="space-y-2 rounded-lg border bg-muted/20 p-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-primary">
                                            Soal #{index + 1}
                                        </span>
                                        <span className="text-xs text-muted-foreground uppercase">
                                            {question.type}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {question.question}
                                    </p>

                                    {question.choices &&
                                        question.choices.length > 0 && (
                                            <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
                                                {question.choices.map((c) => (
                                                    <div
                                                        key={c.id}
                                                        className={`rounded border p-2 text-xs ${
                                                            c.is_correct
                                                                ? 'border-green-300 bg-green-50 font-medium text-green-900'
                                                                : 'bg-background text-foreground'
                                                        }`}
                                                    >
                                                        {c.choice_text}{' '}
                                                        {c.is_correct && '✓'}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4 rounded-xl border bg-card p-6 shadow-xs">
                    <h2 className="text-lg font-bold">
                        Peserta Ujian ({exam.participants?.length ?? 0})
                    </h2>

                    {!exam.participants || exam.participants.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            Belum ada peserta yang mendaftar ujian ini.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-muted/50 text-xs text-muted-foreground uppercase">
                                    <tr>
                                        <th className="px-4 py-3">
                                            Nama Peserta
                                        </th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-center">
                                            Nilai Akhir
                                        </th>
                                        <th className="px-4 py-3 text-center">
                                            Poin
                                        </th>
                                        <th className="px-4 py-3">
                                            Waktu Selesai
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {exam.participants.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {p.user?.name ?? 'Unknown'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {p.user?.email ?? '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        p.status === 'finished'
                                                            ? 'bg-green-100 text-green-800'
                                                            : p.status ===
                                                                'started'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {p.status === 'finished' &&
                                                p.grade != null ? (
                                                    <span
                                                        className={`inline-flex min-w-14 items-center justify-center rounded-lg px-2.5 py-1 text-sm font-bold ${
                                                            p.grade >= 90
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : p.grade >= 75
                                                                  ? 'bg-blue-100 text-blue-800'
                                                                  : p.grade >=
                                                                      60
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {Number(
                                                            p.grade,
                                                        ).toFixed(0)}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                                                {p.status === 'finished' &&
                                                p.score != null
                                                    ? `${p.score} / ${p.max_score}`
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                {p.finished_at
                                                    ? new Date(
                                                          p.finished_at,
                                                      ).toLocaleString('id-ID')
                                                    : '-'}
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
