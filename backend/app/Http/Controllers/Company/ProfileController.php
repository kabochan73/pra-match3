<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyResource;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone_number' => ['sometimes', 'nullable', 'string', 'max:20'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'website_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'prefecture' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $company = $request->user('company');
        $company->update($validated);

        return new CompanyResource($company);
    }
}
