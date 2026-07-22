<?php

namespace App\Http\Controllers;

use App\Models\Skill;

class SkillController extends Controller
{
    public function index()
    {
        return Skill::orderBy('name')->get(['id', 'name']);
    }
}
