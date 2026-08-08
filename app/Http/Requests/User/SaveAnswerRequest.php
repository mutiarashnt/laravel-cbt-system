<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class SaveAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'question_id' => ['required', 'integer'],
            'choice_id' => ['nullable', 'integer'],
            'answer_text' => ['nullable', 'string'],
        ];
    }
}