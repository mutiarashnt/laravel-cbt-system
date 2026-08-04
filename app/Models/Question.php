<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{

    protected $fillable = [
        'question',
        'type',
        'created_by'
    ];


    public function choices()
    {
        return $this->hasMany(Choice::class);
    }


    public function creator()
    {
        return $this->belongsTo(User::class,'created_by');
    }

}