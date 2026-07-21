<?php

namespace App\Models;

use App\Enums\ParticipantType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['application_id', 'sender_type', 'sender_id', 'body', 'read_at'])]
class Message extends Model
{
    const UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'sender_type' => ParticipantType::class,
            'read_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}
