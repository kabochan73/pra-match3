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
        // Laravel標準の通知(database チャンネル)用テーブル。User/Company とも Notifiable トレイトを
        // 使っているため使える状態にはなっているが、実際に ->notify() を呼んでいる箇所は現状まだ無い。
        // morphs('notifiable') は notifiable_type(クラス名文字列)+ notifiable_id の組で、
        // application_status_histories 等の手動実装と違いLaravel標準のポリモーフィックリレーションを使う。
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
