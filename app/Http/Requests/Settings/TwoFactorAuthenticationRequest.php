<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Laravel\Fortify\InteractsWithTwoFactorState;

class TwoFactorAuthenticationRequest extends FormRequest
{
    use InteractsWithTwoFactorState;

    /**
     * @return array<string, mixed>
     */
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [];
    }
}
