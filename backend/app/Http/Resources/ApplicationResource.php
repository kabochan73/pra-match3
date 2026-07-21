<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'applied_at' => $this->applied_at,
            'response_deadline' => $this->response_deadline,
            'company_responded_at' => $this->company_responded_at,
            'job_posting' => $this->whenLoaded('jobPosting', fn () => [
                'id' => $this->jobPosting->id,
                'title' => $this->jobPosting->title,
                'company' => [
                    'name' => $this->jobPosting->company?->name,
                ],
            ]),
        ];
    }
}
