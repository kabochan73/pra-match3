<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case Applied = 'applied';
    case Matched = 'matched';
    case Expired = 'expired';
    case Screening = 'screening';
    case Interviewing = 'interviewing';
    case Offered = 'offered';
    case Rejected = 'rejected';
    case Withdrawn = 'withdrawn';
}
