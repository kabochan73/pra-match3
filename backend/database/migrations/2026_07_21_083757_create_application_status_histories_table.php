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
        // 応募ステータスが変化するたびに1行追加される監査ログ的テーブル(更新日時は不要なので updated_at なし)。
        // 例: MatchController::store が matched に変える際、同じトランザクション内でここにも1件記録する。
        Schema::create('application_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->string('status');
            // changed_by_type/changed_by_id は「誰が変更したか」を表す擬似ポリモーフィック関連。
            // users と companies は別テーブルなので Eloquent の morphTo は使わず、
            // ParticipantType enum(user/company)で種別を持たせ、changed_by_id 側には外部キー制約を付けていない。
            $table->string('changed_by_type');
            $table->unsignedBigInteger('changed_by_id');
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_status_histories');
    }
};
