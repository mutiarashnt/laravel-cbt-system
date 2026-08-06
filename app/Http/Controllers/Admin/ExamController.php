<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreExamRequest;
use App\Http\Requests\Admin\UpdateExamRequest;
use App\Models\Exam;
use App\Services\AdminExamService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    protected AdminExamService $adminExamService;

    public function __construct(AdminExamService $adminExamService)
    {
        $this->adminExamService = $adminExamService;
    }

    /**
     * Display a listing of exams.
     */
    public function index(): Response
    {
        $exams = $this->adminExamService->getAll();

        return Inertia::render('admin/exams/index', [
            'exams' => $exams,
        ]);
    }

    /**
     * Show form to create exam.
     */
    public function create(): Response
    {
        $questions = $this->adminExamService->getAllQuestions();

        return Inertia::render('admin/exams/create', [
            'questions' => $questions,
        ]);
    }

    /**
     * Store new exam.
     */
    public function store(StoreExamRequest $request): RedirectResponse
    {
        $this->adminExamService->store($request->validated());

        return redirect()
            ->route('admin.exams.index')
            ->with('success', 'Ujian berhasil dibuat.');
    }

    /**
     * Display the specified exam with details.
     */
    public function show(Exam $exam): Response
    {
        $exam->load(['questions.choices', 'questions.subject', 'participants.user']);

        return Inertia::render('admin/exams/show', [
            'exam' => $exam,
        ]);
    }

    /**
     * Show form to edit exam.
     */
    public function edit(Exam $exam): Response
    {
        $exam->load('questions');
        $allQuestions = $this->adminExamService->getAllQuestions();

        return Inertia::render('admin/exams/edit', [
            'exam' => $exam,
            'questions' => $allQuestions,
            'selectedQuestionIds' => $exam->questions->pluck('id')->toArray(),
        ]);
    }

    /**
     * Update exam.
     */
    public function update(UpdateExamRequest $request, Exam $exam): RedirectResponse
    {
        $this->adminExamService->update($exam, $request->validated());

        return redirect()
            ->route('admin.exams.index')
            ->with('success', 'Ujian berhasil diperbarui.');
    }

    /**
     * Remove exam.
     */
    public function destroy(Exam $exam): RedirectResponse
    {
        $this->adminExamService->destroy($exam);

        return back()->with('success', 'Ujian berhasil dihapus.');
    }
}
