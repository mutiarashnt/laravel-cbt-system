<?php

namespace App\Services;

use App\Models\Answer;
use App\Models\Choice;
use App\Models\Exam;
use App\Models\Participant;

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
     * Save a single answer without finishing the exam.
     *
     * @param array<string, mixed> $answerData
     */
    public function saveAnswer(
        array $answerData,
        Participant $participant
    ): void {
        if ($participant->status === 'finished') {
            return;
        }

        $questionId = (int) $answerData['question_id'];

        $questionExists = $participant->exam
            ->questions()
            ->where('questions.id', $questionId)
            ->exists();

        if (! $questionExists) {
            abort(422, 'Soal tidak valid untuk ujian ini.');
        }

        $choiceId = isset($answerData['choice_id'])
            ? (int) $answerData['choice_id']
            : null;

        $answerText = $answerData['answer_text'] ?? null;

        if ($choiceId !== null) {
            $choiceExists = Choice::where('id', $choiceId)
                ->where('question_id', $questionId)
                ->exists();

            if (! $choiceExists) {
                abort(422, 'Pilihan jawaban tidak valid.');
            }
        }

        Answer::updateOrCreate(
            [
                'participant_id' => $participant->id,
                'question_id' => $questionId,
            ],
            [
                'choice_id' => $choiceId,
                'answer_text' => $answerText,

                // Jangan bocorkan hasil benar/salah saat autosave.
                'is_correct' => null,
                'score' => 0,
            ]
        );
    }

    /**
     * Submit answers and calculate score/grade.
     * maxScore is based on ALL questions in the exam, not just the submitted ones.
     * Unanswered questions are treated as wrong (score = 0).
     *
     * @param array<int, array<string, mixed>> $answersData
     */
    public function submitExam(
        array $answersData,
        Participant $participant
    ): void {
        if ($participant->status === 'finished') {
            return;
        }

        $exam = Exam::with('questions')
            ->find($participant->exam_id);

        $allQuestions = $exam
            ? $exam->questions
            : collect();

        $totalScore = 0;
        $maxScore = 0;

        foreach ($allQuestions as $question) {
            $maxScore += $question->score ?? 10;
        }

        $submittedByQuestionId = [];

        foreach ($answersData as $item) {
            $submittedByQuestionId[(int) $item['question_id']] = $item;
        }

        foreach ($allQuestions as $question) {
            $questionScore = $question->score ?? 10;

            $item = $submittedByQuestionId[$question->id] ?? null;

            $choiceId = $item['choice_id'] ?? null;
            $answerText = $item['answer_text'] ?? null;

            $isCorrect = null;
            $earnedScore = 0;

            if ($choiceId) {
                $choice = /** @var Choice|null $choice */
                $choice = Choice::find((int) $choiceId);

                $isCorrect = $choice
                    ? $choice->is_correct
                    : false;

                $earnedScore = $isCorrect
                    ? $questionScore
                    : 0;
            }

            $totalScore += $earnedScore;

            Answer::updateOrCreate(
                [
                    'participant_id' => $participant->id,
                    'question_id' => $question->id,
                ],
                [
                    'choice_id' => $choiceId,
                    'answer_text' => $answerText,
                    'is_correct' => $isCorrect,
                    'score' => $earnedScore,
                ]
            );
        }

        $grade = $maxScore > 0
            ? round(($totalScore / $maxScore) * 100, 2)
            : 0;

        $participant->update([
            'status' => 'finished',
            'finished_at' => now(),
            'score' => $totalScore,
            'max_score' => $maxScore,
            'grade' => $grade,
        ]);
    }
}