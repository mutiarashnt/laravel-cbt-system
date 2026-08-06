<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Participant;
use App\Services\ExamService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    protected ExamService $examService;

    public function __construct(ExamService $examService)
    {
        $this->examService = $examService;
    }

    /**
     * Display list of published exams.
     */
    public function index(): Response
    {
        $userId = auth()->id();
        $exams = $this->examService->getPublishedExamsForUser($userId);

        return Inertia::render('user/exams/index', [
            'exams' => $exams,
        ]);
    }

    /**
     * Show exam details and registration status.
     */
    public function show(Exam $exam): Response|RedirectResponse
    {
        if ($exam->status !== 'published') {
            return redirect()->route('user.exams.index')->with('error', 'Ujian belum dipublikasikan.');
        }

        $userId = auth()->id();
        $participant = Participant::where('user_id', $userId)
            ->where('exam_id', $exam->id)
            ->first();

        $exam->loadCount('questions');

        $resultData = $this->examService->getExamResultData($exam, $participant);

        return Inertia::render('user/exams/show', [
            'exam' => $exam,
            'participant' => $participant,
            'result' => $resultData,
        ]);
    }

    /**
     * User exam working session page.
     */
    public function session(Exam $exam): Response|RedirectResponse
    {
        if ($exam->status !== 'published') {
            return redirect()->route('user.exams.index')->with('error', 'Ujian belum dipublikasikan.');
        }

        $userId = auth()->id();
        $participant = Participant::where('user_id', $userId)
            ->where('exam_id', $exam->id)
            ->first();

        if (! $participant) {
            return redirect()
                ->route('user.exams.show', $exam->id)
                ->with('error', 'Anda harus mendaftar ujian terlebih dahulu.');
        }

        if ($participant->status === 'finished') {
            return redirect()
                ->route('user.exams.show', $exam->id)
                ->with('info', 'Ujian ini sudah Anda selesaikan.');
        }

        // Logic for starting exam should ideally be in ParticipantController or ParticipantService,
        // but since we are just marking it as started here if it's registered:
        if ($participant->status === 'registered') {
            app(\App\Services\ParticipantService::class)->startExam($participant);
        }

        $exam->load(['questions.choices']);
        $existingAnswers = $participant->answers()->get(['question_id', 'choice_id', 'answer_text']);

        return Inertia::render('user/exams/session', [
            'exam' => $exam,
            'participant' => $participant,
            'existingAnswers' => $existingAnswers,
        ]);
    }
}
