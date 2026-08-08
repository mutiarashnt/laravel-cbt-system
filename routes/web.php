<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ExamController as AdminExamController;
use App\Http\Controllers\Admin\QuestionController as AdminQuestionController;
use App\Http\Controllers\Admin\SubjectController as AdminSubjectController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\ExamController as UserExamController;
use App\Http\Controllers\User\ParticipantController as UserParticipantController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('user.dashboard');
    })->name('dashboard');
});

// Admin Routes (Protected by auth and admin middleware)
Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::resource('subjects', AdminSubjectController::class);
        Route::resource('questions', AdminQuestionController::class);
        Route::resource('exams', AdminExamController::class);
    });

// User Routes (Protected by auth middleware)
Route::middleware(['auth', 'user'])
    ->prefix('user')
    ->name('user.')
    ->group(function () {
        Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
        Route::get('/exams', [UserExamController::class, 'index'])->name('exams.index');
        Route::get('/exams/{exam}', [UserExamController::class, 'show'])->name('exams.show');
        Route::get('/exams/{exam}/session', [UserExamController::class, 'session'])->name('exams.session');

        Route::post('/participants', [UserParticipantController::class, 'store'])->name('participants.store');
        Route::post('/participants/{participant}/start', [UserParticipantController::class, 'start'])->name('participants.start');
        Route::post('/participants/{participant}/save-answer', [UserParticipantController::class, 'saveAnswer'])->name('participants.saveAnswer');
        Route::post('/participants/{participant}/submit', [UserParticipantController::class, 'submit'])->name('participants.submit');
    });

require __DIR__.'/settings.php';
