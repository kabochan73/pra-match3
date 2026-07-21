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
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            // cascadeOnDelete を付けていないため、応募済み等で削除できない求人がある場合と同様、
            // 企業を削除しようとしても job_postings が残っていればDB側の外部キー制約で拒否される。
            $table->foreignId('company_id')->constrained();
            $table->string('title');
            $table->text('description');
            // employment_type/work_style/position_level/status は string カラムだが、
            // JobPosting モデルの casts() で対応する Enum(EmploymentType など)に変換して扱う。
            $table->string('employment_type');
            $table->string('work_style');
            $table->string('position_level')->nullable();
            $table->unsignedSmallInteger('min_experience_years')->nullable();
            $table->string('prefecture')->nullable();
            $table->unsignedInteger('salary_min')->nullable();
            $table->unsignedInteger('salary_max')->nullable();
            // draft(下書き) -> published(公開) -> closed(募集終了) というステータス遷移。
            $table->string('status')->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            // 公開求人一覧(JobPostingController::index)は status=published を必ず絞り込み条件に持ち、
            // 都道府県での絞り込みも併用されることが多いため複合インデックスを張っている。
            $table->index(['status', 'prefecture']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
