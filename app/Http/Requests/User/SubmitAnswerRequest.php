<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class SubmitAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'answers' => 'array|nullable',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.choice_id' => 'nullable|exists:choices,id',
            'answers.*.answer_text' => 'nullable|string',
        ];
    }
}
