<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MailController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ScheduleController;
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

//Route::get('/country/{id}', [CountryController::class, 'show']);
Route::post('/mail', [MailController::class, 'sendMail']);
Route::post('/doctor/create', [DoctorController::class, 'create']);
Route::get('/doctor/list', [DoctorController::class, 'list']);
Route::get('/doctor/detail/{id}', [DoctorController::class, 'doctorDetail']);
Route::get('/doctor/{id}', [DoctorController::class, 'getById']);
Route::get('/doctor', [DoctorController::class, 'Search']);
Route::post('/booking/create', [BookingController::class, 'create']);
Route::get('/booking', [BookingController::class, 'Search']);
Route::get('/schedule/available', [ScheduleController::class, 'getByDoctorAndDate']);
Route::get('/schedule/{id}', [ScheduleController::class, 'getByDoctorID']);

