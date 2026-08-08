<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\Participant;
use Illuminate\Support\Collection;

class ExamService
{
    /**
     * Get published exams and their participant status for a specific user.
     */
    public function getPublishedExamsForUser(int $userId): Collection
    {
        return Exam::where('status', 'published')
            ->withCount('questions')
            ->latest()
            ->get()
            ->map(function ($exam) use ($userId) {
                $participant = Participant::where('user_id', $userId)
                    ->where('exam_id', $exam->id)
                    ->first();

                $exam->user_participant = $participant;

                return $exam;
            });
    }

    /**
     * Get exam details and format the results if the user has finished.
     */
    /** @return array<string, mixed>|null */
    public function getExamResultData(Exam $exam, ?Participant $participant): ?array
    {
        if (! $participant || $participant->status !== 'finished') {
            return null;
        }

        $answers = $participant->answers()
            ->with([
                'question.choices',
                'choice',
            ])
            ->get();

        return [
            'score' => $participant->score,
            'max_score' => $participant->max_score,
            'grade' => $participant->grade,
            'correct_count' => $answers->where('is_correct', true)->count(),
            'wrong_count' => $answers->whereStrict('is_correct', false)->count(),
            'unanswered_count' => $answers->whereNull('is_correct')->count(),
            'answers' => $answers->map(function ($answer) {
                return [
                    'question_id' => $answer->question_id,
                    'question_text' => $answer->question->question ?? '',
                    'score' => $answer->score,
                    'question_max_score' => $answer->question->score ?? 10,
                    'is_correct' => $answer->is_correct,
                    'chosen_choice_text' => $answer->choice->choice_text ?? null,
                    'choices' => $answer->question ? $answer->question->choices->map(function ($c) {
                        return [
                            'id' => $c->id,
                            'choice_text' => $c->choice_text,
                            'is_correct' => $c->is_correct,
                        ];
                    }) : [],
                ];
            }),
        ];
    }
}
