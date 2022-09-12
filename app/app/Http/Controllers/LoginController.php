<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller
{
	private function base64UrlEncode($text)
	{
		return str_replace(
			['+', '/', '='],
			['-', '_', ''],
			base64_encode($text)
		);
	}

	private function GetJwtToken(Request $request) : string
	{
		$bodyContent = json_decode($request->getContent());
		$data = DB::table('doctor')->where('email', $bodyContent->username)->where('password', $bodyContent->password)->get();
		if (count($data) === 0)
		{
			return '';
		}

		$payload = json_encode([
			'email' => $data[0]->email,
			'password' => $data[0]->password
		]);
		
		// Encode Payload
		$base64UrlPayload = $this->base64UrlEncode($payload);

		// Create Signature Hash
		$secret = getenv('SECRET_KEY');
		$signature = hash_hmac('sha256', $base64UrlPayload, $secret, true);

		// Encode Signature to Base64Url String
		$base64UrlSignature = $this->base64UrlEncode($signature);

		// Create JWT
		$jwt = $base64UrlPayload . "." . $base64UrlSignature;

		return $jwt;
	}

	public function HandleLoginRequest(Request $request) : JsonResponse
	{
		$jwtToken = $this->GetJwtToken($request);
		if(empty($jwtToken)) {
			return response()->json(['message' => "incorrect username or password"], HTTP_UNAUTHORIZED);
		}
		return response()->json(['token' => $jwtToken]);
	}
}
