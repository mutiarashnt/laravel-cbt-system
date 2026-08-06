<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSubjectRequest;
use App\Http\Requests\Admin\UpdateSubjectRequest;
use App\Models\Subject;
use App\Services\SubjectService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    protected SubjectService $subjectService;

    public function __construct(SubjectService $subjectService)
    {
        $this->subjectService = $subjectService;
    }

    /**
     * Menampilkan daftar mata pelajaran
     */
    public function index(): Response
    {
        $subjects = $this->subjectService->getAllWithQuestionCount();

        return Inertia::render('admin/subjects/index', [
            'subjects' => $subjects,
        ]);
    }

    /**
     * Menyimpan mata pelajaran baru
     */
    public function store(StoreSubjectRequest $request): RedirectResponse
    {
        $this->subjectService->store($request->validated());

        return redirect()
            ->route('admin.subjects.index')
            ->with('success', 'Mata pelajaran berhasil ditambahkan.');
    }

    /**
     * Memperbarui mata pelajaran
     */
    public function update(UpdateSubjectRequest $request, Subject $subject): RedirectResponse
    {
        $this->subjectService->update($subject, $request->validated());

        return redirect()
            ->route('admin.subjects.index')
            ->with('success', 'Mata pelajaran berhasil diperbarui.');
    }

    /**
     * Menghapus mata pelajaran
     */
    public function destroy(Subject $subject): RedirectResponse
    {
        $this->subjectService->destroy($subject);

        return back()->with('success', 'Mata pelajaran berhasil dihapus.');
    }
}
