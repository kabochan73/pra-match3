<?php

namespace App\Console\Commands;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('applications:expire')]
#[Description('7日以内に企業が反応しなかった応募をexpiredに更新する')]
class ExpireApplications extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = Application::where('status', ApplicationStatus::Applied)
            ->where('response_deadline', '<', now())
            ->update(['status' => ApplicationStatus::Expired]);

        $this->info("{$count}件の応募をexpiredに更新しました。");
    }
}
