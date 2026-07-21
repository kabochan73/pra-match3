<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['job_posting_subscription_id', 'stripe_invoice_id', 'amount', 'status', 'paid_at'])]
class Payment extends Model
{
    const UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'status' => PaymentStatus::class,
            'paid_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function jobPostingSubscription(): BelongsTo
    {
        return $this->belongsTo(JobPostingSubscription::class);
    }
}
