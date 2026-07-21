<?php

namespace App\Models;

use App\Enums\InterviewMethod;
use App\Enums\InterviewScheduleStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['application_id', 'status', 'method', 'location_or_url', 'confirmed_starts_at'])]
class InterviewSchedule extends Model
{
    protected function casts(): array
    {
        return [
            'status' => InterviewScheduleStatus::class,
            'method' => InterviewMethod::class,
            'confirmed_starts_at' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function slots(): HasMany
    {
        return $this->hasMany(InterviewScheduleSlot::class);
    }
}
