<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreQuestionRequest;
use App\Http\Requests\Admin\UpdateQuestionRequest;
use App\Models\Question;
use App\Services\QuestionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    protected QuestionService $questionService;

    public function __construct(QuestionService $questionService)
    {
        $this->questionService = $questionService;
    }

    /**
     * Menampilkan semua soal
     */
    public function index(): Response
    {
        $questions = $this->questionService->getAllWithRelations();
        $subjects = $this->questionService->getAllSubjectsWithQuestionCount();

        return Inertia::render('admin/questions/index', [
            'questions' => $questions,
            'subjects' => $subjects,
        ]);
    }

    /**
     * Form tambah soal
     */
    public function create(): Response
    {
        $subjects = $this->questionService->getAllSubjects();

        return Inertia::render('admin/questions/create', [
            'subjects' => $subjects,
        ]);
    }

    /**
     * Simpan soal baru
     */
    public function store(StoreQuestionRequest $request): RedirectResponse
    {
        $this->questionService->store($request->validated());

        return redirect()
            ->route('admin.questions.index')
            ->with('success', 'Soal berhasil dibuat.');
    }

    /**
     * Form edit soal
     */
    public function edit(Question $question): Response
    {
        $question->load(['choices', 'subject']);
        $subjects = $this->questionService->getAllSubjects();

        return Inertia::render('admin/questions/edit', [
            'question' => $question,
            'subjects' => $subjects,
        ]);
    }

    /**
     * Update soal
     */
    public function update(UpdateQuestionRequest $request, Question $question): RedirectResponse
    {
        $this->questionService->update($question, $request->validated());

        return redirect()
            ->route('admin.questions.index')
            ->with('success', 'Soal berhasil diperbarui.');
    }

    /**
     * Hapus soal
     */
    public function destroy(Question $question): RedirectResponse
    {
        $this->questionService->destroy($question);

        return back()->with('success', 'Soal berhasil dihapus.');
    }
}
