import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Clock, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Exam } from '@/types';

interface Props {
    exams: Exam[];
}

export default function Index({ exams }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/user/dashboard' },
        { title: 'Daftar Ujian', href: '/user/exams' },
    ];

    const handleRegister = (examId: number) => {
        router.post('/user/participants', { exam_id: examId });
    };

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Ujian Tersedia" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Daftar Ujian Tersedia</h1>
                    <p className="text-muted-foreground text-sm">
                        Pilih ujian dan lakukan pendaftaran untuk dapat mengerjakan.
                    </p>
                </div>

                {exams.length === 0 ? (
                    <div className="rounded-xl border bg-card p-12 text-center shadow-xs">
                        <p className="text-muted-foreground text-sm">Belum ada ujian yang tersedia saat ini.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {exams.map((exam) => {
                            const participant = exam.user_participant;
                            const isRegistered = !!participant;

                            return (
                                <div
                                    key={exam.id}
                                    className="rounded-xl border bg-card p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-primary/50 transition-colors"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-muted-foreground uppercase">
                                                CBT Online
                                            </span>
                                            {isRegistered && (
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${participant.status === 'finished'
                                                        ? 'bg-green-100 text-green-800'
                                                        : participant.status === 'started'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                >
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    {participant.status === 'finished'
                                                        ? 'Selesai'
                                                        : participant.status === 'started'
                                                            ? 'Sedang Berlangsung'
                                                            : 'Terdaftar'}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-lg font-bold line-clamp-1">{exam.title}</h2>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {exam.description || 'Tidak ada petunjuk khusus.'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{exam.duration} Menit</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <HelpCircle className="h-3.5 w-3.5" />
                                            <span>{exam.questions_count ?? 0} Soal</span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t">
                                        {isRegistered ? (
                                            <Link
                                                href={`/user/exams/${exam.id}`}
                                                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                                            >
                                                <span>
                                                    {participant.status === 'finished'
                                                        ? 'Lihat Ujian'
                                                        : 'Lanjutkan Ujian'}
                                                </span>
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handleRegister(exam.id)}
                                                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 text-sm font-medium transition-colors"
                                            >
                                                <span>Daftar Ujian</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
