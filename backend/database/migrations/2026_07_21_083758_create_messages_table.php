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
        // マッチ成立後の1対1チャット。application_status_histories と同様、
        // sender_type/sender_id で「求職者(user)か企業(company)か」を表す擬似ポリモーフィック関連。
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->string('sender_type');
            $table->unsignedBigInteger('sender_id');
            $table->text('body');
            // 相手側がまだ読んでいないメッセージの判定に使う(MessageController::index が
            // 自分宛の未読メッセージをまとめて read_at 更新する = 既読化)。
            $table->timestamp('read_at')->nullable();
            $table->timestamp('created_at')->nullable();

            // 応募ごとのメッセージを時系列順で取得する(oldest('created_at'))ためのインデックス。
            $table->index(['application_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
