export interface Subject {
    id: number;
    name: string;
    code?: string | null;
    description?: string | null;
    questions_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Choice {
    id: number;
    question_id: number;
    choice_text: string;
    is_correct?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Question {
    id: number;
    subject_id?: number | null;
    question: string;
    type: 'multiple_choice' | 'essay';
    score: number;
    created_by: number;
    choices?: Choice[];
    subject?: Subject | null;
    created_at?: string;
    updated_at?: string;
}

export interface ExamQuestion {
    id: number;
    exam_id: number;
    question_id: number;
    created_at?: string;
    updated_at?: string;
}

export interface Exam {
    id: number;
    title: string;
    description: string | null;
    duration: number;
    status: 'draft' | 'published';
    created_by: number;
    questions_count?: number;
    participants_count?: number;
    questions?: Question[];
    user_participant?: Participant | null;
    created_at?: string;
    updated_at?: string;
}

export interface Participant {
    id: number;
    user_id: number;
    exam_id: number;
    status: 'registered' | 'started' | 'finished';
    score: number | null;
    max_score: number | null;
    grade: number | null;
    registered_at: string;
    started_at: string | null;
    finished_at: string | null;
    exam?: Exam;
    answers?: Answer[];
    created_at?: string;
    updated_at?: string;
}

export interface Answer {
    id?: number;
    participant_id: number;
    question_id: number;
    choice_id: number | null;
    answer_text: string | null;
    is_correct?: boolean | null;
    score?: number;
}

export interface AnswerResult {
    question_id: number;
    question_text: string;
    score: number;
    question_max_score: number;
    is_correct: boolean | null;
    chosen_choice_text: string | null;
    choices: {
        id: number;
        choice_text: string;
        is_correct: boolean;
    }[];
}

export interface ExamResult {
    score: number;
    max_score: number;
    grade: number;
    correct_count: number;
    wrong_count: number;
    unanswered_count: number;
    answers: AnswerResult[];
}
