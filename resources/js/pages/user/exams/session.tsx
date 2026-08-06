import { useState, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { Clock, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Exam, Participant } from '@/types';

interface ExistingAnswer {
    question_id: number;
    choice_id: number | null;
    answer_text: string | null;
}

interface Props {
    exam: Exam;
    participant: Participant;
    existingAnswers: ExistingAnswer[];
}

export default function Session({ exam, participant, existingAnswers }: Props) {
    const questions = exam.questions || [];
    const [currentIndex, setCurrentIndex] = useState(0);

    // Map initial user answers
    const [answersMap, setAnswersMap] = useState<
        Record<number, { choice_id: number | null; answer_text: string | null }>
    >(() => {
        const initialMap: Record<
            number,
            { choice_id: number | null; answer_text: string | null }
        > = {};
        existingAnswers.forEach((ans) => {
            initialMap[ans.question_id] = {
                choice_id: ans.choice_id,
                answer_text: ans.answer_text,
            };
        });

        return initialMap;
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Timer calculation
    const [timeLeft, setTimeLeft] = useState<number>(() => {
        if (!participant.started_at) {
            return exam.duration * 60;
        }

        const startTime = new Date(participant.started_at).getTime();
        const endTime = startTime + exam.duration * 60 * 1000;
        const remaining = Math.floor((endTime - Date.now()) / 1000);

        return remaining > 0 ? remaining : 0;
    });

    // Deklarasikan handleSubmitAnswers SEBELUM digunakan di useEffect
    const handleSubmitAnswers = useCallback(() => {
        if (isSubmitting) {
            return;
        }

        const payload = {
            answers: Object.entries(answersMap).map(([questionId, val]) => ({
                question_id: parseInt(questionId),
                choice_id: val.choice_id,
                answer_text: val.answer_text,
            })),
        };

        setIsSubmitting(true);
        router.post(`/user/participants/${participant.id}/submit`, payload, {
            onFinish: () => setIsSubmitting(false),
        });
    }, [isSubmitting, answersMap, participant.id]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitAnswers();

                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [handleSubmitAnswers]);

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;

        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentIndex];
    const currentAnswer = answersMap[currentQuestion?.id] || {
        choice_id: null,
        answer_text: null,
    };

    const handleSelectChoice = (choiceId: number) => {
        if (!currentQuestion) {
            return;
        }

        setAnswersMap((prev) => ({
            ...prev,
            [currentQuestion.id]: {
                choice_id: choiceId,
                answer_text: null,
            },
        }));
    };

    const handleEssayChange = (text: string) => {
        if (!currentQuestion) {
            return;
        }

        setAnswersMap((prev) => ({
            ...prev,
            [currentQuestion.id]: {
                choice_id: null,
                answer_text: text,
            },
        }));
    };

    const confirmSubmit = () => {
        const totalAnswered = Object.values(answersMap).filter(
            (a) =>
                a.choice_id !== null ||
                (a.answer_text && a.answer_text.trim() !== ''),
        ).length;

        if (
            confirm(
                `Anda telah menjawab ${totalAnswered} dari ${questions.length} soal. Apakah Anda yakin ingin menyelesaikan ujian?`,
            )
        ) {
            handleSubmitAnswers();
        }
    };

    if (!currentQuestion) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
                <p className="text-muted-foreground">
                    Tidak ada soal tersedia untuk ujian ini.
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Head title={`Sesi Ujian - ${exam.title}`} />

            {/* Header / Timer Bar */}
            <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4 shadow-xs">
                <div>
                    <h1 className="line-clamp-1 text-lg font-bold text-foreground">
                        {exam.title}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Soal {currentIndex + 1} dari {questions.length}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div
                        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm font-bold ${
                            timeLeft < 300
                                ? 'animate-pulse border-red-200 bg-red-50 text-red-600'
                                : 'bg-muted/50 text-foreground'
                        }`}
                    >
                        <Clock className="h-4 w-4" />
                        <span>Sisa Waktu: {formatTimer(timeLeft)}</span>
                    </div>

                    <button
                        onClick={confirmSubmit}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-green-700"
                    >
                        <Send className="h-4 w-4" />
                        <span>Selesai Ujian</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-4">
                {/* Left Side: Question Area (3 Cols) */}
                <div className="space-y-6 lg:col-span-3">
                    <div className="space-y-6 rounded-xl border bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between border-b pb-4">
                            <span className="text-sm font-semibold text-primary">
                                Pertanyaan #{currentIndex + 1}
                            </span>
                            <span className="rounded bg-muted px-2.5 py-1 text-xs text-muted-foreground uppercase">
                                {currentQuestion.type === 'multiple_choice'
                                    ? 'Pilihan Ganda'
                                    : 'Essay'}
                            </span>
                        </div>

                        {/* Question Text */}
                        <div className="text-base leading-relaxed font-medium text-foreground">
                            {currentQuestion.question}
                        </div>

                        {/* Options / Answer Input */}
                        <div className="pt-2">
                            {currentQuestion.type === 'multiple_choice' &&
                            currentQuestion.choices ? (
                                <div className="space-y-3">
                                    {currentQuestion.choices.map(
                                        (choice, idx) => {
                                            const isSelected =
                                                currentAnswer.choice_id ===
                                                choice.id;
                                            const optionLetter =
                                                String.fromCharCode(65 + idx);

                                            return (
                                                <label
                                                    key={choice.id}
                                                    onClick={() =>
                                                        handleSelectChoice(
                                                            choice.id,
                                                        )
                                                    }
                                                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                                                        isSelected
                                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                            : 'hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div
                                                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                                                            isSelected
                                                                ? 'border-primary bg-primary text-primary-foreground'
                                                                : 'bg-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        {optionLetter}
                                                    </div>
                                                    <span className="pt-0.5 text-sm font-medium text-foreground">
                                                        {choice.choice_text}
                                                    </span>
                                                </label>
                                            );
                                        },
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-muted-foreground">
                                        Tuliskan jawaban Anda di bawah ini:
                                    </label>
                                    <textarea
                                        rows={6}
                                        value={currentAnswer.answer_text || ''}
                                        onChange={(e) =>
                                            handleEssayChange(e.target.value)
                                        }
                                        className="w-full rounded-lg border p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-hidden"
                                        placeholder="Jawaban essay..."
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() =>
                                setCurrentIndex((prev) => Math.max(prev - 1, 0))
                            }
                            disabled={currentIndex === 0}
                            className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Sebelumnya
                        </button>

                        <button
                            onClick={() =>
                                setCurrentIndex((prev) =>
                                    Math.min(prev + 1, questions.length - 1),
                                )
                            }
                            disabled={currentIndex === questions.length - 1}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40"
                        >
                            Selanjutnya
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Right Side: Question Navigation Grid (1 Col) */}
                <div className="space-y-4">
                    <div className="space-y-4 rounded-xl border bg-white p-5 shadow-xs">
                        <h2 className="text-sm font-bold text-foreground">
                            Navigasi Soal
                        </h2>

                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, idx) => {
                                const ans = answersMap[q.id];
                                const isAnswered =
                                    ans &&
                                    (ans.choice_id !== null ||
                                        (ans.answer_text &&
                                            ans.answer_text.trim() !== ''));
                                const isCurrent = idx === currentIndex;

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`relative flex h-10 items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                                            isCurrent
                                                ? 'border-primary ring-2 ring-primary ring-offset-1'
                                                : ''
                                        } ${
                                            isAnswered
                                                ? 'border-green-600 bg-green-600 text-white'
                                                : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="space-y-2 border-t pt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="inline-block h-3 w-3 rounded-sm bg-green-600" />
                                <span>Sudah dijawab</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-block h-3 w-3 rounded-sm bg-gray-200" />
                                <span>Belum dijawab</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

Session.layout = (page: React.ReactNode) => page;
