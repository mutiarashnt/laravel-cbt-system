<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property Participant|null $user_participant
 */
class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'duration',
        'status',
        'created_by',
    ];

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<ExamQuestion, $this> */
    public function examQuestions(): HasMany
    {
        return $this->hasMany(ExamQuestion::class);
    }

    /** @return BelongsTo<Question, $this> */
    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class, 'exam_questions');
    }

    /** @return HasMany<Participant, $this> */
    public function participants(): HasMany
    {
        return $this->hasMany(Participant::class);
    }
}
