<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class BookingController extends Controller
{
    public function create(Request $request) :JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'bail|required',
            'date' => 'bail|required',
            'customer_phone' => 'bail|required|numeric|digits:10',
            'customer_email' => 'bail|required|email',
            'customer_name' => 'bail|required',
            'shift' => 'bail|required|numeric',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->add('error', 'true'));
        }
        $dataBooking = [
            "doctor_id" => $request->input('doctor_id', null),
            "date" => $request->input('date', null),
            "customer_phone" => $request->input('customer_phone', null),
            "customer_email" => $request->input('customer_email', null),
            "customer_name" => $request->input('customer_name', null),
            "shift" => $request->input('shift', null),
        ];
        $dataSchedule = DB::table('schedule')
            ->where('doctor_id', $dataBooking['doctor_id'])
            ->where('date', $dataBooking['date'])
            ->where('shift', '!=', 3)
            ->get();
        if (count($dataSchedule) === 0) {
            return response()->json(['message' => 'Schedule not found'], 404);
        }
        $schedule = $dataSchedule[0];
        if (in_array($schedule->shift, [1, 2])) {
            $dataBooking['shift'] = 3;
        }
        DB::table('schedule')->insert($dataBooking);
        return response()->json(['message' => 'Schedule created successfully']);
    }
}
