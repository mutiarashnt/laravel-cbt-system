<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\RegisterExamRequest;
use App\Http\Requests\User\SubmitAnswerRequest;
use App\Models\Participant;
use App\Services\ParticipantService;
use Illuminate\Http\RedirectResponse;

class ParticipantController extends Controller
{
    protected ParticipantService $participantService;

    public function __construct(ParticipantService $participantService)
    {
        $this->participantService = $participantService;
    }

    /**
     * User registers for an exam.
     */
    public function store(RegisterExamRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $userId = auth()->id();

        $participant = $this->participantService->registerForExam($userId, $validated['exam_id']);

        return redirect()
            ->route('user.exams.show', $participant->exam_id)
            ->with('success', 'Berhasil mendaftar ujian.');
    }

    /**
     * User starts taking the exam.
     */
    public function start(Participant $participant): RedirectResponse
    {
        if ($participant->user_id !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        $this->participantService->startExam($participant);

        return redirect()->route('user.exams.session', $participant->exam_id);
    }

    /**
     * User submits exam answers and finishes.
     */
    public function submit(SubmitAnswerRequest $request, Participant $participant): RedirectResponse
    {
        if ($participant->user_id !== auth()->id()) {
            abort(403, 'Akses ditolak.');
        }

        if ($participant->status === 'finished') {
            return redirect()
                ->route('user.exams.show', $participant->exam_id)
                ->with('info', 'Ujian telah selesai dikerjakan.');
        }

        $validated = $request->validated();

        $this->participantService->submitExam($validated['answers'], $participant);

        return redirect()
            ->route('user.exams.show', $participant->exam_id)
            ->with('success', 'Selamat, ujian telah berhasil diselesaikan!');
    }
}
