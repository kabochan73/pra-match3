<?php

namespace App\Http\Controllers\Company;

use App\Enums\ApplicationStatus;
use App\Enums\ParticipantType;
use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyApplicantResource;
use App\Models\Application;
use App\Models\ApplicationStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MatchController extends Controller
{
    public function store(Request $request, Application $application)
    {
        $company = $request->user('company');

        abort_if($application->jobPosting->company_id !== $company->id, 403);
        abort_if($application->status !== ApplicationStatus::Applied, 409, 'このステータスの応募には対応できません。');
        abort_if(now()->greaterThan($application->response_deadline), 409, '応募受付期限を過ぎています。');

        DB::transaction(function () use ($application, $company) {
            $application->update([
                'status' => ApplicationStatus::Matched,
                'company_responded_at' => now(),
            ]);

            ApplicationStatusHistory::create([
                'application_id' => $application->id,
                'status' => ApplicationStatus::Matched,
                'changed_by_type' => ParticipantType::Company,
                'changed_by_id' => $company->id,
            ]);
        });

        return new CompanyApplicantResource($application->load('user.skills'));
    }
}
