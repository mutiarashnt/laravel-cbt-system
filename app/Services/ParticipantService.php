<?php

namespace App\Services;

use App\Models\Answer;
use App\Models\Choice;
use App\Models\Exam;
use App\Models\Participant;
use App\Models\Question;

class ParticipantService
{
    /**
     * Register a user for an exam.
     */
    public function registerForExam(int $userId, int $examId): Participant
    {
        $exam = Exam::where('id', $examId)
            ->where('status', 'published')
            ->firstOrFail();

        return Participant::firstOrCreate(
            [
                'user_id' => $userId,
                'exam_id' => $exam->id,
            ],
            [
                'status' => 'registered',
                'registered_at' => now(),
            ]
        );
    }

    /**
     * Start the exam session for a participant.
     */
    public function startExam(Participant $participant): void
    {
        if ($participant->status === 'registered') {
            $participant->update([
                'status' => 'started',
                'started_at' => now(),
            ]);
        }
    }

    /**
     * Submit answers and calculate score/grade.
     */
    public function submitExam(array $answersData, Participant $participant): void
    {
        if ($participant->status === 'finished') {
            return;
        }

        $totalScore = 0;
        $maxScore = 0;

        foreach ($answersData as $item) {
            $choiceId = $item['choice_id'] ?? null;
            $answerText = $item['answer_text'] ?? null;

            $question = Question::find($item['question_id']);
            $questionScore = $question ? $question->score : 10;
            $maxScore += $questionScore;

            $isCorrect = null;
            $earnedScore = 0;

            if ($choiceId) {
                $choice = Choice::find($choiceId);
                $isCorrect = $choice ? $choice->is_correct : false;
                $earnedScore = $isCorrect ? $questionScore : 0;
            }

            $totalScore += $earnedScore;

            Answer::updateOrCreate(
                [
                    'participant_id' => $participant->id,
                    'question_id' => $item['question_id'],
                ],
                [
                    'choice_id' => $choiceId,
                    'answer_text' => $answerText,
                    'is_correct' => $isCorrect,
                    'score' => $earnedScore,
                ]
            );
        }

        $grade = $maxScore > 0 ? round(($totalScore / $maxScore) * 100, 2) : 0;

        $participant->update([
            'status' => 'finished',
            'finished_at' => now(),
            'score' => $totalScore,
            'max_score' => $maxScore,
            'grade' => $grade,
        ]);
    }
}
