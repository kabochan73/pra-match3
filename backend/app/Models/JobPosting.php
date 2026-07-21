<?php

namespace App\Models;

use App\Enums\EmploymentType;
use App\Enums\JobPostingStatus;
use App\Enums\PositionLevel;
use App\Enums\WorkStyle;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'company_id',
    'title',
    'description',
    'employment_type',
    'work_style',
    'position_level',
    'min_experience_years',
    'prefecture',
    'salary_min',
    'salary_max',
    'status',
    'published_at',
])]
class JobPosting extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'employment_type' => EmploymentType::class,
            'work_style' => WorkStyle::class,
            'position_level' => PositionLevel::class,
            'status' => JobPostingStatus::class,
            'published_at' => 'datetime',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'job_posting_skills');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(JobPostingSubscription::class);
    }
}
