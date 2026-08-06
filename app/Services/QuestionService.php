<?php

namespace App\Services;

use App\Models\Question;
use App\Models\Subject;

class QuestionService
{
    /**
     * Ambil semua soal beserta relasi choices dan subject.
     */
    public function getAllWithRelations()
    {
        return Question::with(['choices', 'subject'])
            ->latest()
            ->get();
    }

    /**
     * Ambil semua subject (untuk dropdown).
     */
    public function getAllSubjects()
    {
        return Subject::orderBy('name')->get();
    }

    /**
     * Ambil semua subject beserta jumlah soal.
     */
    public function getAllSubjectsWithQuestionCount()
    {
        return Subject::withCount('questions')
            ->orderBy('name')
            ->get();
    }

    /**
     * Simpan soal baru beserta pilihan jawaban.
     */
    public function store(array $data): Question
    {
        $question = Question::create([
            'subject_id' => $data['subject_id'] ?? null,
            'question' => $data['question'],
            'type' => $data['type'] ?? 'multiple_choice',
            'created_by' => auth()->id(),
        ]);

        foreach ($data['choices'] as $index => $choiceText) {
            $question->choices()->create([
                'choice_text' => $choiceText,
                'is_correct' => ($index == $data['correct_answer']),
            ]);
        }

        return $question;
    }

    /**
     * Perbarui soal dan pilihan jawaban.
     */
    public function update(Question $question, array $data): Question
    {
        $question->update([
            'subject_id' => $data['subject_id'] ?? null,
            'question' => $data['question'],
            'type' => $data['type'] ?? $question->type,
        ]);

        $question->choices()->delete();

        foreach ($data['choices'] as $index => $choiceText) {
            $question->choices()->create([
                'choice_text' => $choiceText,
                'is_correct' => ($index == $data['correct_answer']),
            ]);
        }

        return $question;
    }

    /**
     * Hapus soal.
     */
    public function destroy(Question $question): void
    {
        $question->delete();
    }
}
