<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\Participant;
use App\Models\Question;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class DashboardService
{
    /**
     * Get dashboard statistics for a specific user.
     */
    /** @return array<string, int> */
    public function getUserDashboardStats(int $userId): array
    {
        $participations = Participant::where('user_id', $userId)->get();

        return [
            'registered' => $participations->where('status', 'registered')->count(),
            'started' => $participations->where('status', 'started')->count(),
            'finished' => $participations->where('status', 'finished')->count(),
            'total_available' => Exam::where('status', 'published')->count(),
        ];
    }

    /**
     * Get dashboard statistics for admin.
     */
    /** @return array<string, int> */
    public function getAdminDashboardStats(): array
    {
        return [
            'total_questions' => Question::count(),
            'total_exams' => Exam::count(),
            'total_participants' => Participant::count(),
            'total_users' => User::where('role', 'user')->count(),
        ];
    }

    /**
     * Get recent exams for admin dashboard.
     *
     * @return Collection
     * @return \Illuminate\Database\Eloquent\Collection<int, Model>
     */
    public function getRecentExams(int $limit = 5)
    {
        return Exam::withCount('questions', 'participants')
            ->latest()
            ->take($limit)
            ->get();
    }
}
