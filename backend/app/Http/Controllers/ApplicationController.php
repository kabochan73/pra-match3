<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\JobPostingStatus;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Models\JobPosting;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function store(Request $request, JobPosting $jobPosting)
    {
        abort_if($jobPosting->status !== JobPostingStatus::Published, 404);

        $alreadyApplied = Application::where('user_id', $request->user()->id)
            ->where('job_posting_id', $jobPosting->id)
            ->exists();

        abort_if($alreadyApplied, 409, 'この求人には既に応募済みです。');

        $application = Application::create([
            'user_id' => $request->user()->id,
            'job_posting_id' => $jobPosting->id,
            'status' => ApplicationStatus::Applied,
            'applied_at' => now(),
            'response_deadline' => now()->addDays(7),
        ]);

        $application->load(['jobPosting.company']);

        return (new ApplicationResource($application))->response()->setStatusCode(201);
    }
}
