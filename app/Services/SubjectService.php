<?php

namespace App\Services;

use App\Models\Subject;

class SubjectService
{
    /**
     * Ambil semua mata pelajaran beserta jumlah soal.
     */
    public function getAllWithQuestionCount()
    {
        return Subject::withCount('questions')
            ->latest()
            ->get();
    }

    /**
     * Simpan mata pelajaran baru.
     */
    public function store(array $data): Subject
    {
        return Subject::create($data);
    }

    /**
     * Perbarui mata pelajaran.
     */
    public function update(Subject $subject, array $data): Subject
    {
        $subject->update($data);

        return $subject;
    }

    /**
     * Hapus mata pelajaran.
     */
    public function destroy(Subject $subject): void
    {
        $subject->delete();
    }
}
