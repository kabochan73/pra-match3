<?php

namespace App\Http\Controllers;

use App\Enums\JobPostingStatus;
use App\Http\Resources\JobPostingResource;
use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{
    public function index(Request $request)
    {
        $query = JobPosting::query()
            ->where('status', JobPostingStatus::Published)
            ->with(['company', 'skills']);

        if ($keyword = $request->string('keyword')->trim()->value()) {
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        if ($request->filled('employment_type')) {
            $query->where('employment_type', $request->string('employment_type')->value());
        }

        if ($request->filled('work_style')) {
            $query->where('work_style', $request->string('work_style')->value());
        }

        if ($request->filled('prefecture')) {
            $query->where('prefecture', $request->string('prefecture')->value());
        }

        if ($request->filled('salary_min')) {
            $query->where('salary_max', '>=', $request->integer('salary_min'));
        }

        if ($request->filled('salary_max')) {
            $query->where('salary_min', '<=', $request->integer('salary_max'));
        }

        $jobPostings = $query->paginate(20);

        return JobPostingResource::collection($jobPostings);
    }

    public function show(JobPosting $jobPosting)
    {
        abort_if($jobPosting->status !== JobPostingStatus::Published, 404);

        $jobPosting->load(['company', 'skills']);

        return new JobPostingResource($jobPosting);
    }
}
