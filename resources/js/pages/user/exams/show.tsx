import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    BookOpen,
    AlertCircle,
    PlayCircle,
    CheckCircle,
    XCircle,
    Award,
    BarChart2,
    ChevronDown,
    ChevronUp,
    Minus,
} from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/layouts/user-layout';
import type { Exam, Participant, ExamResult } from '@/types/cbt';

interface Props {
    exam: Exam;
    participant: Participant | null;
    result: ExamResult | null;
}

function GradeColor(grade: number): { bg: string; text: string; badge: string } {
    if (grade >= 90) {
return { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' };
}

    if (grade >= 75) {
return { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' };
}

    if (grade >= 60) {
return { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-800' };
}

    return { bg: 'bg-red-50 border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
}

function GradeLabel(grade: number): string {
    if (grade >= 90) {
return 'Sangat Baik';
}

    if (grade >= 75) {
return 'Baik';
}

    if (grade >= 60) {
return 'Cukup';
}

    return 'Kurang';
}

export default function Show({ exam, participant, result }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/user/dashboard' },
        { title: 'Daftar Ujian', href: '/user/exams' },
        { title: exam.title, href: `/user/exams/${exam.id}` },
    ];

    const [showDetail, setShowDetail] = useState(false);

    const handleRegister = () => {
        router.post('/user/participants', { exam_id: exam.id });
    };

    const handleStart = () => {
        if (!participant) {
return;
}

        router.post(`/user/participants/${participant.id}/start`);
    };

    const gradeColor = result ? GradeColor(Number(result.grade)) : null;

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Ujian - ${exam.title}`} />

            <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">{exam.title}</h1>
                    <Link
                        href="/user/exams"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                </div>

                {/* Info Ujian */}
                <div className="rounded-xl border bg-card p-6 shadow-xs space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/40">
                            <Clock className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Durasi Ujian</p>
                                <p className="text-base font-bold">{exam.duration} Menit</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/40">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Jumlah Soal</p>
                                <p className="text-base font-bold">{exam.questions_count ?? 0} Soal</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-sm font-semibold text-foreground">Petunjuk & Ketentuan Ujian</h2>
                        <div className="p-4 rounded-lg border text-sm text-muted-foreground bg-muted/20 space-y-2">
                            <p>{exam.description || 'Tidak ada petunjuk tambahan dari penguji.'}</p>
                            <ul className="list-disc list-inside space-y-1 pt-2 border-t text-xs">
                                <li>Pastikan koneksi internet Anda stabil sebelum memulai ujian.</li>
                                <li>Waktu akan terus berjalan setelah Anda menekan tombol "Mulai Ujian".</li>
                                <li>Jawaban tersimpan secara otomatis setiap kali Anda memilih pilihan.</li>
                                <li>Nilai maksimal tiap soal adalah <strong>10 poin</strong>.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        {!participant ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>Anda harus mendaftar ujian terlebih dahulu sebelum dapat mengerjakannya.</span>
                                </div>
                                <button
                                    onClick={handleRegister}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs hover:opacity-90 transition-opacity"
                                >
                                    Daftar Ujian Sekarang
                                </button>
                            </div>
                        ) : participant.status === 'finished' ? (
                            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
                                <CheckCircle className="h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-semibold">Ujian Telah Selesai</p>
                                    <p className="text-xs text-green-600 mt-0.5">
                                        Anda sudah menyelesaikan ujian ini pada{' '}
                                        {participant.finished_at ? new Date(participant.finished_at).toLocaleString('id-ID') : '-'}.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>
                                        Status Anda:{' '}
                                        <strong className="capitalize">{participant.status}</strong>. Siap untuk memulai ujian?
                                    </span>
                                </div>
                                <button
                                    onClick={handleStart}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs hover:opacity-90 transition-opacity"
                                >
                                    <PlayCircle className="h-5 w-5" />
                                    Mulai Kerjakan Ujian
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Kartu Hasil Ujian */}
                {result && gradeColor && (
                    <div className="space-y-4">
                        {/* Score Card */}
                        <div className={`rounded-xl border-2 p-6 shadow-sm ${gradeColor.bg}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${gradeColor.badge}`}>
                                        <Award className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-widest ${gradeColor.text}`}>
                                            Hasil Ujian Anda
                                        </p>
                                        <p className={`text-5xl font-extrabold leading-none mt-1 ${gradeColor.text}`}>
                                            {Number(result.grade).toFixed(0)}
                                        </p>
                                        <p className={`text-sm font-medium mt-0.5 ${gradeColor.text}`}>
                                            dari 100 — <span className="font-bold">{GradeLabel(Number(result.grade))}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className={`rounded-xl p-4 space-y-1.5 text-sm ${gradeColor.badge} min-w-44`}>
                                    <div className="flex justify-between gap-4 font-medium">
                                        <span>Total Poin</span>
                                        <span className="font-bold">{result.score} / {result.max_score}</span>
                                    </div>
                                    <div className="w-full bg-white/60 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-current transition-all duration-500"
                                            style={{ width: `${(Number(result.score) / (Number(result.max_score) || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistik */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-xl border bg-card p-4 text-center shadow-xs">
                                <div className="flex justify-center mb-1">
                                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                                </div>
                                <p className="text-2xl font-extrabold text-emerald-600">{result.correct_count}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Jawaban Benar</p>
                            </div>

                            <div className="rounded-xl border bg-card p-4 text-center shadow-xs">
                                <div className="flex justify-center mb-1">
                                    <XCircle className="h-6 w-6 text-red-500" />
                                </div>
                                <p className="text-2xl font-extrabold text-red-600">{result.wrong_count}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Jawaban Salah</p>
                            </div>

                            <div className="rounded-xl border bg-card p-4 text-center shadow-xs">
                                <div className="flex justify-center mb-1">
                                    <Minus className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="text-2xl font-extrabold text-gray-500">{result.unanswered_count}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Tidak Dijawab</p>
                            </div>
                        </div>

                        {/* Rincian Jawaban Per Soal */}
                        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setShowDetail(!showDetail)}
                                className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <BarChart2 className="h-5 w-5 text-primary" />
                                    <span className="font-semibold text-sm">Rincian Jawaban Per Soal</span>
                                </div>
                                {showDetail ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                )}
                            </button>

                            {showDetail && (
                                <div className="border-t divide-y">
                                    {result.answers.map((answer, index) => (
                                        <div key={answer.question_id} className="p-4 space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-2.5 flex-1">
                                                    <span className={`mt-0.5 shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                                                        answer.is_correct === true
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : answer.is_correct === false
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {index + 1}
                                                    </span>
                                                    <p className="text-sm font-medium text-foreground leading-snug">
                                                        {answer.question_text}
                                                    </p>
                                                </div>

                                                <div className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                    answer.is_correct === true
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : answer.is_correct === false
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {answer.is_correct === true ? (
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                    ) : answer.is_correct === false ? (
                                                        <XCircle className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Minus className="h-3.5 w-3.5" />
                                                    )}
                                                    +{answer.score} / {answer.question_max_score}
                                                </div>
                                            </div>

                                            {/* Pilihan Jawaban */}
                                            <div className="ml-8 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                {answer.choices.map((choice) => {
                                                    const isChosen = choice.choice_text === answer.chosen_choice_text;

                                                    return (
                                                        <div
                                                            key={choice.id}
                                                            className={`text-xs px-3 py-2 rounded-lg border flex items-center gap-1.5 ${
                                                                choice.is_correct
                                                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium'
                                                                    : isChosen && !choice.is_correct
                                                                    ? 'bg-red-50 border-red-300 text-red-800'
                                                                    : 'bg-muted/30 border-transparent text-muted-foreground'
                                                            }`}
                                                        >
                                                            {choice.is_correct && (
                                                                <CheckCircle className="h-3 w-3 text-emerald-600 shrink-0" />
                                                            )}
                                                            {isChosen && !choice.is_correct && (
                                                                <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                                                            )}
                                                            {choice.choice_text}
                                                            {isChosen && (
                                                                <span className="ml-auto text-[10px] font-semibold opacity-70">
                                                                    (Pilihan Anda)
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {answer.is_correct === null && (
                                                <p className="ml-8 text-xs text-muted-foreground italic">
                                                    Soal ini tidak dijawab.
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
