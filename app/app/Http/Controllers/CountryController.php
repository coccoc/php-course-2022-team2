<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
class CountryController extends Controller
{
    /**
     * Show the profile for a given user.
     *
     * @param int $id
     * @return \Illuminate\View\View
     */
    public function show(Request $request, $id)
    {
//        dd($id);
        $result = DB::table('country')->get();
//        $header = ($request->header('Authorization'));
//        return json_encode($header);
        return response()->json($result);
    }

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
//        if ($data['message'] == null || $data['subject'] == null || $data['receiver'] == null) {
//            return response()->json(['message' => 'Please fill all fields [message, subject, receiver]'], 400);
//        }
        $url = getenv('EVOUCHER_DOMAIN');
        $response = Http::post($url, [
            'message' => $data['message'],
            'subject' => $data['subject'],
            "receiver" => $data['receiver'],
        ]);
        return response($response->body());
    }
}
