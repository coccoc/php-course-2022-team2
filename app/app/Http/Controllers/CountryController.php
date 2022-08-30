<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;

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

    public function sendMail()
    {
        $response = Http::post('https://evoucher-api.urbox.dev/v1/language', [
            'message' => "<p>This is normal text - <b>and this is bold text</b>.</p>",
            'subject' => 'Network Administrator',
            "receiver" => "tuan.dc@urbox.vn",
        ]);
        return response($response->body());
    }
}
