import { Head, Link } from '@inertiajs/react';
import {
    ClipboardList,
    CheckCircle,
    PlayCircle,
    BookOpen,
    Clock,
    ArrowRight,
} from 'lucide-react';
import UserLayout from '@/layouts/user-layout';
import type { Exam } from '@/types/cbt';

interface Stats {
    registered: number;
    started: number;
    finished: number;
    total_available: number;
}

interface Props {
    stats: Stats;
    exams: Exam[];
}

export default function Dashboard({ stats, exams }: Props) {
    const breadcrumbs = [{ title: 'Dashboard', href: '/user/dashboard' }];

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Peserta" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard Peserta
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Selamat datang di portal pengerjaan ujian online CBT.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Ujian Tersedia
                            </span>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                            {stats.total_available}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Terdaftar
                            </span>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                            {stats.registered}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                Sedang Dikerjakan
                            </span>
                            <PlayCircle className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                            {stats.started}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Selesai</span>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                            {stats.finished}
                        </div>
                    </div>
                </div>

                {/* Daftar Ujian Tersedia */}
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">
                                Ujian Tersedia
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Pilih ujian yang ingin Anda kerjakan di bawah
                                ini.
                            </p>
                        </div>
                    </div>

                    {exams.length === 0 ? (
                        <div className="rounded-xl border bg-card p-8 text-center shadow-xs">
                            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-semibold">
                                Tidak Ada Ujian
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Belum ada ujian yang dipublikasikan saat ini.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {exams.map((exam) => (
                                <div
                                    key={exam.id}
                                    className="flex flex-col rounded-xl border bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
                                >
                                    <div className="mb-4 flex-1">
                                        <h3 className="line-clamp-2 text-lg leading-tight font-semibold">
                                            {exam.title}
                                        </h3>
                                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                            {exam.description ||
                                                'Tidak ada deskripsi'}
                                        </p>
                                    </div>

                                    <div className="mt-auto space-y-4">
                                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-4 w-4 text-primary" />
                                                <span>
                                                    {exam.duration} Menit
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <BookOpen className="h-4 w-4 text-primary" />
                                                <span>
                                                    {exam.questions_count ?? 0}{' '}
                                                    Soal
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t pt-4">
                                            {exam.user_participant ? (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                        exam.user_participant
                                                            .status ===
                                                        'finished'
                                                            ? 'bg-green-100 text-green-800'
                                                            : exam
                                                                    .user_participant
                                                                    .status ===
                                                                'started'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {exam.user_participant
                                                        .status === 'registered'
                                                        ? 'Terdaftar'
                                                        : exam.user_participant
                                                                .status ===
                                                            'started'
                                                          ? 'Sedang Dikerjakan'
                                                          : 'Selesai'}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800">
                                                    Belum Daftar
                                                </span>
                                            )}

                                            <Link
                                                href={`/user/exams/${exam.id}`}
                                                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                                            >
                                                Lihat Detail
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
