<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use App\Enums\ParticipantType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['application_id', 'status', 'changed_by_type', 'changed_by_id'])]
class ApplicationStatusHistory extends Model
{
    const UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'status' => ApplicationStatus::class,
            'changed_by_type' => ParticipantType::class,
            'created_at' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}
