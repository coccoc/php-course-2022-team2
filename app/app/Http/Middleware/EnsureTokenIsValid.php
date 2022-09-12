<?php

namespace App\Http\Middleware;
 
use Closure;
 
class EnsureTokenIsValid
{

	private function base64UrlEncode($text)
	{
		return str_replace(
			['+', '/', '='],
			['-', '_', ''],
			base64_encode($text)
		);
	}
	
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		$jwt = $request->header('Authorization');
		$tokenParts = explode('.', $jwt);

		$payload = base64_decode($tokenParts[0]);
		$signatureProvided = $tokenParts[1];
		// get the local secret key
		$base64UrlPayload = $this->base64UrlEncode($payload);
		$secret = getenv('SECRET_KEY');
		$signature = hash_hmac('sha256', $base64UrlPayload, $secret, true);


		$base64UrlSignature = $this->base64UrlEncode($signature);

		//compare signature
		if ($base64UrlSignature === $signatureProvided) 
		{
			return $next($request);
		}
		return redirect('home');
	}
}
