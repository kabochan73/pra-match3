<?php

namespace App\Enums;

enum InterviewScheduleStatus: string
{
    case Proposed = 'proposed';
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';
}
