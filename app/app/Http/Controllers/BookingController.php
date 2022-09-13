<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\MailController;

class BookingController extends Controller
{
    public function create(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'doctor_id' => 'bail|required|numeric',
            'date' => 'bail|required',
            'customer_phone' => 'bail|required|numeric|digits:10',
            'customer_email' => 'bail|required|email',
            'customer_name' => 'bail|required',
            'shift' => 'bail|required|numeric',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), HTTP_BAD_REQUEST);
        }
        $dataBooking = [
            "doctor_id" => $request->input('doctor_id', null),
            "date" => $request->input('date', null),
            "customer_phone" => $request->input('customer_phone', null),
            "customer_email" => $request->input('customer_email', null),
            "customer_name" => $request->input('customer_name', null),
            "shift" => $request->input('shift', null),
        ];
        // $response = MailController::sendBookingMail($dataBooking);

        $dataSchedule = DB::table('schedule')
            ->where('doctor_id', $dataBooking['doctor_id'])
            ->where('date', $dataBooking['date'])
            ->whereIn('shift', [$dataBooking['shift'], FULLTIME_SHIFT])
            ->where('booked', '!=', $dataBooking['shift'])
            ->get();
        if (count($dataSchedule) === 0) {
            return response()->json(['message' => 'Schedule not found'], HTTP_NOT_FOUND);
        }
        $schedule = $dataSchedule[0];
        if (in_array($schedule->booked, [MORNING_SHIFT, AFTERNOON_SHIFT])) {
            DB::table('schedule')
                ->where('id', $schedule->id)
                ->update(['booked' => FULLTIME_SHIFT]);
        } else {
            DB::table('schedule')
                ->where('id', $schedule->id)
                ->update(['booked' => $dataBooking['shift']]);
        }
        DB::table('booking')->insert($dataBooking);
        return response()->json(['message' => 'Schedule created successfully']);
    }

    public function Search(Request $request): JsonResponse
    {
        $dataSearch = [
            "date" => $request->input('date', null),
            "doctor_id" => $request->input('doctor_id', null),
        ];
        $dataSearch = array_filter($dataSearch);
        $data = DB::table('schedule')->where($dataSearch)->get();
        if (count($data) === 0) {
            return response()->json(['message' => 'Schedule not found'], HTTP_NOT_FOUND);
        }
        $result = $data[0];
        return response()->json($result);
    }

    public function listBooking(Request $request, $id): JsonResponse
    {
        $data = DB::table('booking')->where('doctor_id', $id)->orderBy('date', 'asc')->get();

        // dd($data);

        if (count($data) === 0) {
            return response()->json(['message' => 'Doctor not found'], HTTP_NOT_FOUND);
        }

        return response()->json($data);
    }
}