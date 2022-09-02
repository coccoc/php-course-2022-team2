<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\DoctorController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/country/{id}', [CountryController::class, 'show']);
Route::post('/mail', [CountryController::class, 'sendMail']);
Route::post('/doctor/create', [DoctorController::class, 'create']);
Route::get('/doctor/{id}', [DoctorController::class, 'getById']);

