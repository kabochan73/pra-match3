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
        // JobPosting <-> Skill の多対多を表す中間テーブル(JobPosting::skills() が参照)。
        // (job_posting_id, skill_id) の複合主キーで同じ組み合わせの重複登録を防ぎ、
        // 求人側から skill_id で絞り込めるよう個別インデックスも張っている。
        // 求人・スキルどちらが削除されても紐付けごと自動削除(cascadeOnDelete)。
        Schema::create('job_posting_skills', function (Blueprint $table) {
            $table->foreignId('job_posting_id')->constrained()->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained()->cascadeOnDelete();

            $table->primary(['job_posting_id', 'skill_id']);
            $table->index('skill_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_posting_skills');
    }
};
