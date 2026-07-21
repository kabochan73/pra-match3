<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'description' => $this->description,
            'website_url' => $this->website_url,
            'prefecture' => $this->prefecture,
            'created_at' => $this->created_at,
        ];
    }
}
