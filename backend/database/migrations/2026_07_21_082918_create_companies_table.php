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
        // 企業アカウント。users とは完全に別テーブル・別モデル(Company)で、
        // ログインは auth:company ガードを使い、求職者(users)とは認証を混同しない。
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone_number')->nullable();
            $table->text('description')->nullable();
            $table->string('website_url')->nullable();
            $table->string('prefecture')->nullable();
            // 求人掲載の課金(Stripe)に使う顧客ID。現状 Company モデルの Fillable/casts には
            // 含まれておらず、対応するコントローラも未実装(課金機能は今後実装予定と思われる)。
            $table->string('stripe_customer_id')->nullable()->unique();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
