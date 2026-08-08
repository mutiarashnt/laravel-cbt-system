<?php

namespace App\Services;

use App\Models\Subject;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class SubjectService
{
    /**
     * Ambil semua mata pelajaran beserta jumlah soal.
     *
     * @return Collection<int, Model>
     */
    public function getAllWithQuestionCount(): Collection
    {
        return Subject::withCount('questions')
            ->latest()
            ->get();
    }

    /**
     * Simpan mata pelajaran baru.
     *
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): Subject
    {
        return Subject::create($data);
    }

    /**
     * Perbarui mata pelajaran.
     *
     * @param  array<string, mixed>  $data
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
