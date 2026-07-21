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
        // Laravel Sanctum の個人アクセストークン用テーブル。User/Company モデルは HasApiTokens
        // トレイトを使っているため発行自体は可能だが、実際の認証は bootstrap/app.php の
        // statefulApi() によるSPA向けセッション認証(auth:web/auth:company)で行っており、
        // ->createToken() でのトークン発行は現状どこからも呼ばれていない(未使用)。
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};
