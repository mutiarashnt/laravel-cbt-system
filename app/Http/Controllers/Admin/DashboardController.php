<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index(): Response
    {
        $stats = $this->dashboardService->getAdminDashboardStats();
        $recentExams = $this->dashboardService->getRecentExams();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentExams' => $recentExams,
        ]);
    }
}
