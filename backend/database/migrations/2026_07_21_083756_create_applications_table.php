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
        // 求職者の応募そのものを表す中心的なテーブル。
        // ApplicationStatusHistory(状態変化の履歴)や Message(マッチ後のやり取り)はこの application_id にぶら下がる。
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('job_posting_id')->constrained();
            // applied(応募済み) -> matched(マッチ成立) or expired(期限切れ) という基本フロー。
            // ApplicationStatus enum には screening/interviewing/offered/rejected/withdrawn も定義済みだが、
            // 現状のコントローラでは applied/matched/expired までしか遷移させていない(選考以降は未実装)。
            $table->string('status')->default('applied');
            $table->timestamp('applied_at');
            // 応募時に「今から7日後」で設定される(ApplicationController::store)。
            // ExpireApplications コマンドがこの期限切れ&未対応の応募を expired に一括更新する。
            $table->timestamp('response_deadline');
            $table->timestamp('company_responded_at')->nullable();
            $table->timestamps();

            // 同じ求職者が同じ求人へ重複応募できないようDBレベルでも保証(アプリ側の exists() チェックの保険)。
            $table->unique(['user_id', 'job_posting_id']);
            $table->index('user_id');
            $table->index('job_posting_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
