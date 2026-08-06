<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\Question;

class AdminExamService
{
    /**
     * Ambil semua ujian beserta relasi creator, questions, dan participants.
     */
    public function getAll()
    {
        return Exam::with('creator')
            ->withCount('questions', 'participants')
            ->latest()
            ->get();
    }

    /**
     * Ambil semua soal untuk form create/edit exam.
     */
    public function getAllQuestions()
    {
        return Question::with(['choices', 'subject'])->latest()->get();
    }

    /**
     * Simpan ujian baru beserta sinkronisasi soal.
     */
    public function store(array $data): Exam
    {
        $exam = Exam::create([
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'duration'    => $data['duration'],
            'status'      => $data['status'],
            'created_by'  => auth()->id(),
        ]);

        if (! empty($data['question_ids'])) {
            $exam->questions()->sync($data['question_ids']);
        }

        return $exam;
    }

    /**
     * Perbarui ujian beserta sinkronisasi soal.
     */
    public function update(Exam $exam, array $data): Exam
    {
        $exam->update([
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'duration'    => $data['duration'],
            'status'      => $data['status'],
        ]);

        if (isset($data['question_ids'])) {
            $exam->questions()->sync($data['question_ids']);
        } else {
            $exam->questions()->detach();
        }

        return $exam;
    }

    /**
     * Hapus ujian.
     */
    public function destroy(Exam $exam): void
    {
        $exam->delete();
    }
}
