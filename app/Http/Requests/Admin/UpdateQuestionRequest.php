<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'subject_id' => 'nullable|exists:subjects,id',
            'question' => 'required|string',
            'type' => 'nullable|in:multiple_choice,essay',
            'choices' => 'required|array|min:2',
            'choices.*' => 'required|string',
            'correct_answer' => 'required|integer|min:0',
        ];
    }
}
