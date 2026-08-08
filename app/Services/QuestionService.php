<?php

namespace App\Services;

use App\Models\Question;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class QuestionService
{
    /**
     * Ambil semua soal beserta relasi choices dan subject.
     *
     * @return Collection<int, Model>
     */
    public function getAllWithRelations(): Collection
    {
        return Question::with(['choices', 'subject'])
            ->latest()
            ->get();
    }

    /**
     * Ambil semua subject (untuk dropdown).
     *
     * @return Collection<int, Model>
     */
    public function getAllSubjects(): Collection
    {
        return Subject::orderBy('name')->get();
    }

    /**
     * Ambil semua subject beserta jumlah soal.
     *
     * @return Collection<int, Model>
     */
    public function getAllSubjectsWithQuestionCount(): Collection
    {
        return Subject::withCount('questions')
            ->orderBy('name')
            ->get();
    }

    /**
     * Simpan soal baru beserta pilihan jawaban.
     *
     * @param  array<string, mixed>  $data
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
     *
     * @param  array<string, mixed>  $data
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
