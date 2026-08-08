<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Services\ExamService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    protected ExamService $examService;

    public function __construct(DashboardService $dashboardService, ExamService $examService)
    {
        $this->dashboardService = $dashboardService;
        $this->examService = $examService;
    }

    public function index(): Response
    {
        $userId = (int) auth()->id();

        $stats = $this->dashboardService->getUserDashboardStats($userId);
        $exams = $this->examService->getPublishedExamsForUser($userId);

        return Inertia::render('user/dashboard', [
            'stats' => $stats,
            'exams' => $exams,
        ]);
    }
}
