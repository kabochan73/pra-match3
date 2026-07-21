<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\ParticipantType;
use App\Http\Resources\MessageResource;
use App\Models\Application;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, Application $application)
    {
        abort_if($application->user_id !== $request->user()->id, 403);

        $application->messages()
            ->where('sender_type', ParticipantType::Company)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = $application->messages()->oldest('created_at')->paginate(50);

        return MessageResource::collection($messages);
    }

    public function store(Request $request, Application $application)
    {
        abort_if($application->user_id !== $request->user()->id, 403);

        abort_if(
            in_array($application->status, [ApplicationStatus::Applied, ApplicationStatus::Expired], true),
            409,
            'マッチが成立していないためメッセージを送信できません。'
        );

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $message = Message::create([
            'application_id' => $application->id,
            'sender_type' => ParticipantType::User,
            'sender_id' => $request->user()->id,
            'body' => $validated['body'],
        ]);

        return (new MessageResource($message))->response()->setStatusCode(201);
    }
}
