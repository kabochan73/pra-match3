<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\CompanyAuthController;
use App\Http\Controllers\Company\ApplicantController;
use App\Http\Controllers\Company\JobPostingController as CompanyJobPostingController;
use App\Http\Controllers\Company\MatchController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\ProfileController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 求職者
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::middleware('auth:web')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn (Request $request) => new UserResource($request->user()->load('skills')));
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/job-postings/{jobPosting}/applications', [ApplicationController::class, 'store']);
});

// 求人(公開)
Route::get('/job-postings', [JobPostingController::class, 'index']);
Route::get('/job-postings/{jobPosting}', [JobPostingController::class, 'show']);

// 企業
Route::prefix('company')->group(function () {
    Route::post('/register', [CompanyAuthController::class, 'register']);
    Route::post('/login', [CompanyAuthController::class, 'login']);
    Route::middleware('auth:company')->group(function () {
        Route::post('/logout', [CompanyAuthController::class, 'logout']);
        Route::get('/user', fn (Request $request) => $request->user('company'));
        Route::get('/job-postings', [CompanyJobPostingController::class, 'index']);
        Route::post('/job-postings', [CompanyJobPostingController::class, 'store']);
        Route::patch('/job-postings/{jobPosting}', [CompanyJobPostingController::class, 'update']);
        Route::delete('/job-postings/{jobPosting}', [CompanyJobPostingController::class, 'destroy']);
        Route::get('/job-postings/{jobPosting}/applicants', [ApplicantController::class, 'index']);
        Route::post('/applications/{application}/match', [MatchController::class, 'store']);
    });
});
