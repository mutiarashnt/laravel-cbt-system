<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * @return array<string, mixed>
     */
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return $this->profileRules($this->user()->id);
    }
}
