<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Menampilkan semua soal
     */
    public function index()
    {
        $questions = Question::with('choices')
            ->latest()
            ->get();

        return Inertia::render('admin/questions/index', [
            'questions' => $questions
        ]);
    }


    /**
     * Form tambah soal
     */
    public function create()
    {
        return Inertia::render('admin/questions/create');
    }


    /**
     * Simpan soal baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'choices' => 'required|array|min:2',
            'correct_answer' => 'required|integer',
        ]);


        $question = Question::create([
            'question' => $validated['question'],
            'type' => 'multiple_choice',
            'created_by' => auth()->id(),
        ]);


        foreach ($validated['choices'] as $index => $choice) {

            $question->choices()->create([
                'choice_text' => $choice,
                'is_correct' =>
                    $index == $validated['correct_answer'],
            ]);

        }


        return redirect()
            ->route('admin.questions.index')
            ->with('success','Soal berhasil dibuat');
    }


    /**
     * Form edit
     */
    public function edit(Question $question)
    {
        $question->load('choices');

        return Inertia::render(
            'admin/questions/edit',
            [
                'question'=>$question
            ]
        );
    }


    /**
     * Update soal
     */
    public function update(
        Request $request,
        Question $question
    )
    {

        $validated=$request->validate([
            'question'=>'required|string',
            'choices'=>'required|array',
            'correct_answer'=>'required|integer',
        ]);


        $question->update([
            'question'=>$validated['question']
        ]);


        $question->choices()->delete();


        foreach($validated['choices'] as $index=>$choice){

            $question->choices()->create([
                'choice_text'=>$choice,
                'is_correct'=>
                    $index==$validated['correct_answer']
            ]);

        }


        return redirect()
            ->route('admin.questions.index');
    }



    /**
     * Hapus soal
     */
    public function destroy(Question $question)
    {
        $question->delete();


        return back();
    }
}