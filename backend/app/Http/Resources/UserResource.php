<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'birthdate' => $this->birthdate,
            'bio' => $this->bio,
            'skills' => $this->whenLoaded('skills', fn () => $this->skills->map(fn ($skill) => [
                'id' => $skill->id,
                'name' => $skill->name,
            ])),
            'created_at' => $this->created_at,
        ];
    }
}
