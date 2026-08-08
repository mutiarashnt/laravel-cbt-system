<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = [
        'participant_id',
        'question_id',
        'choice_id',
        'answer_text',
        'is_correct',
        'score',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    /** @return BelongsTo<Participant, $this> */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    /** @return BelongsTo<Question, $this> */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    /** @return BelongsTo<Choice, $this> */
    public function choice(): BelongsTo
    {
        return $this->belongsTo(Choice::class);
    }
}
