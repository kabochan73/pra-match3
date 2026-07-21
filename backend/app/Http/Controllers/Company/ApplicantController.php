<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyApplicantResource;
use App\Models\JobPosting;
use Illuminate\Http\Request;

class ApplicantController extends Controller
{
    public function index(Request $request, JobPosting $jobPosting)
    {
        abort_if($jobPosting->company_id !== $request->user('company')->id, 403);

        $applicants = $jobPosting->applications()
            ->with('user.skills')
            ->latest('applied_at')
            ->paginate(20);

        return CompanyApplicantResource::collection($applicants);
    }
}
