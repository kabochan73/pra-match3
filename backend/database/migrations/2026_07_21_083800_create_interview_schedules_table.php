<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 面談調整機能用のテーブル。マイグレーション/モデル(InterviewSchedule)は存在するが、
        // 対応するControllerがまだ無く、API経由では未使用(今後実装予定と思われる)。
        // application_id が unique なので1応募につき面談スケジュールは1件のみ(1対1)。
        Schema::create('interview_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->unique()->constrained()->cascadeOnDelete();
            // proposed(候補日提示) -> confirmed(確定) / cancelled(中止) という想定の遷移。
            $table->string('status')->default('proposed');
            $table->string('method')->nullable();
            $table->string('location_or_url')->nullable();
            $table->timestamp('confirmed_starts_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interview_schedules');
    }
};
