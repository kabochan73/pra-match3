<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone_number' => ['sometimes', 'nullable', 'string', 'max:20'],
            'birthdate' => ['sometimes', 'nullable', 'date'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'skill_ids' => ['sometimes', 'array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],
        ]);

        $user = $request->user();

        $user->update(collect($validated)->except('skill_ids')->all());

        if (array_key_exists('skill_ids', $validated)) {
            $user->skills()->sync($validated['skill_ids']);
        }

        return new UserResource($user->load('skills'));
    }
}
