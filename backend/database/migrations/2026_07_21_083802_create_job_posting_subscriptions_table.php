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
        // 求人掲載の課金(Stripeサブスクリプション)機能用テーブル。これも対応するControllerは未実装。
        // job_posting_id が unique なので求人1件につき課金契約は1件(1対1)。
        Schema::create('job_posting_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->unique()->constrained();
            $table->foreignId('company_id')->constrained();
            $table->string('stripe_subscription_id')->nullable()->unique();
            $table->string('stripe_price_id')->nullable();
            // trialing(お試し期間) -> active(課金中) -> past_due/canceled/unpaid という
            // Stripeサブスクリプションのステータスをそのまま反映する想定。
            $table->string('status')->default('trialing');
            $table->timestamp('trial_ends_at');
            $table->timestamp('current_period_start')->nullable();
            $table->timestamp('current_period_end')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_posting_subscriptions');
    }
};
