<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
class MailController extends Controller
{

    public function sendMail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'bail|required',
            'receiver' => 'bail|required|email',
            'subject' => 'bail|required|min:8',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->add('error', 'true'));
        }
        $data = [
            "message" => $request->input('message', null),
            "subject" => $request->input('subject', null),
            "receiver" => $request->input('receiver', null),
        ];
        $url = getenv('EVOUCHER_DOMAIN');
        $response = Http::post($url, [
            'message' => $data['message'],
            'subject' => $data['subject'],
            "receiver" => $data['receiver'],
        ]);
        return response($response->body());
    }

    public static function sendBookingMail($data)
    {
        $shift =[1=>'Sáng',2=>'Chiều'];
        $url = getenv('EVOUCHER_DOMAIN');
        $message = EMAIL_TEMPLATE;
        $message = str_replace("{name}", $data['customer_name'], $message);
        $message = str_replace("{date}", $data['date'], $message);
        $message = str_replace("{shift}", $shift[$data['shift']], $message);
//        dd($message);
        $response = Http::post($url, [
            'message' => $message,
            'subject' => "Đặt lịch hẹn khám thành công",
            "receiver" => $data['customer_email'],
        ]);
        return response($response->body());
    }
}
