<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class SubmitAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.choice_id' => 'nullable|exists:choices,id',
            'answers.*.answer_text' => 'nullable|string',
        ];
    }
}
