<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['interview_schedule_id', 'starts_at', 'ends_at', 'is_selected'])]
class InterviewScheduleSlot extends Model
{
    const UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'is_selected' => 'boolean',
            'created_at' => 'datetime',
        ];
    }

    public function interviewSchedule(): BelongsTo
    {
        return $this->belongsTo(InterviewSchedule::class);
    }
}
