<?php

namespace App\Http\Controllers\Company;

use App\Enums\EmploymentType;
use App\Enums\JobPostingStatus;
use App\Enums\PositionLevel;
use App\Enums\WorkStyle;
use App\Http\Controllers\Controller;
use App\Http\Resources\JobPostingResource;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class JobPostingController extends Controller
{
    public function index(Request $request)
    {
        $jobPostings = JobPosting::where('company_id', $request->user('company')->id)
            ->with('skills')
            ->latest()
            ->paginate(20);

        return JobPostingResource::collection($jobPostings);
    }

    public function show(Request $request, JobPosting $jobPosting)
    {
        abort_if($jobPosting->company_id !== $request->user('company')->id, 403);

        return new JobPostingResource($jobPosting->load(['company', 'skills']));
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules(sometimes: false));

        $jobPosting = new JobPosting(collect($validated)->except('skill_ids')->all());
        $jobPosting->company_id = $request->user('company')->id;
        $jobPosting->status ??= JobPostingStatus::Draft;

        if (($validated['status'] ?? null) === JobPostingStatus::Published->value) {
            $jobPosting->published_at = now();
        }

        $jobPosting->save();

        if (array_key_exists('skill_ids', $validated)) {
            $jobPosting->skills()->sync($validated['skill_ids']);
        }

        return (new JobPostingResource($jobPosting->load(['company', 'skills'])))->response()->setStatusCode(201);
    }

    public function update(Request $request, JobPosting $jobPosting)
    {
        abort_if($jobPosting->company_id !== $request->user('company')->id, 403);

        $validated = $request->validate($this->rules(sometimes: true));

        $jobPosting->fill(collect($validated)->except('skill_ids')->all());

        if (($validated['status'] ?? null) === JobPostingStatus::Published->value && ! $jobPosting->published_at) {
            $jobPosting->published_at = now();
        }

        $jobPosting->save();

        if (array_key_exists('skill_ids', $validated)) {
            $jobPosting->skills()->sync($validated['skill_ids']);
        }

        return new JobPostingResource($jobPosting->load(['company', 'skills']));
    }

    public function destroy(Request $request, JobPosting $jobPosting)
    {
        abort_if($jobPosting->company_id !== $request->user('company')->id, 403);

        abort_if(
            $jobPosting->applications()->exists(),
            409,
            '応募済みの求職者がいるため削除できません。募集終了(closed)への変更をご利用ください。'
        );

        $jobPosting->delete();

        return response()->noContent();
    }

    private function rules(bool $sometimes): array
    {
        $required = $sometimes ? 'sometimes' : 'required';

        return [
            'title' => [$required, 'string', 'max:255'],
            'description' => [$required, 'string'],
            'employment_type' => [$required, Rule::enum(EmploymentType::class)],
            'work_style' => [$required, Rule::enum(WorkStyle::class)],
            'position_level' => ['nullable', Rule::enum(PositionLevel::class)],
            'min_experience_years' => ['nullable', 'integer', 'min:0'],
            'prefecture' => ['nullable', 'string', 'max:255'],
            'salary_min' => ['nullable', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'min:0', 'gte:salary_min'],
            'status' => ['sometimes', Rule::in(['draft', 'published', 'closed'])],
            'skill_ids' => ['sometimes', 'array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],
        ];
    }
}
