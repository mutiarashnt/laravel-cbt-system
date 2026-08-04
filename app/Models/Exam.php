<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $fillable = [

        'title',
        'description',
        'duration',
        'status',
        'created_by',

    ];
}