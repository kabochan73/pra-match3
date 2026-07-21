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
        // 1つの面談調整(interview_schedules)に対する候補日時の複数提示(1対多)。
        // is_selected でどの候補が実際に選ばれたかを表す想定(これも現状は未使用)。
        Schema::create('interview_schedule_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('interview_schedule_id')->constrained()->cascadeOnDelete();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->boolean('is_selected')->default(false);
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interview_schedule_slots');
    }
};
