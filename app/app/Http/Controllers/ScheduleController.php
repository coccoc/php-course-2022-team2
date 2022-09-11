<?php
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class ScheduleController extends Controller
{
    public function getByDoctorAndDate(Request $request): JsonResponse
    {
        $data = [
          "date" => $request->input('date', null),
          "doctor_id" => $request->input('doctor_id', null),
        ];
        $dataSchedule = DB::table('schedule')
            ->where('doctor_id', $data['doctor_id'])
            ->where('date', $data['date'])
            ->get();
        if (count($dataSchedule) === 0) {
            return response()->json(['message' => 'Schedule not found'], HTTP_NOT_FOUND);
        }
        $schedule = $dataSchedule[0];
        return response()->json($schedule);
    }


    public function listSchedule(Request $request, $id) {

        $data = DB::table('schedule')->where('doctor_id', $id)->get();

        if (count($data) === 0) {
            return response()->json(['message' => 'Doctor not found'], HTTP_NOT_FOUND);
        }
        
        return response()->json($data);
    }

    public function getByDoctorID(Request $request, $id): JsonResponse
    {
        $data = DB::table('schedule')->where('doctor_id', $id)->get();
        if(count($data)===0){
            return response()->json(['message'=>'Schedule not found'], HTTP_NOT_FOUND);
        }
        $schedule = $data;
        return response()->json($schedule);
    }

    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'doctor_id' => 'bail|required|numeric',
            'date' => 'bail|required',
            'shift' => 'bail|required|numeric',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), HTTP_BAD_REQUEST);
        }

        $newSchedule = [
            "doctor_id" => $request->input('doctor_id', null),
            "date" => $request->input('date', null),
            "shift" => $request->input('shift', null),
        ];

        $dataSchedule = DB::table('schedule') 
        ->where('doctor_id', $newSchedule['doctor_id'])
        ->where('date', $newSchedule['date'])
        ->get();

        if (count($dataSchedule) === 0) {
            DB::table('schedule')->insert($newSchedule);
        } else {
            DB::table('schedule')
            ->where('doctor_id', $newSchedule['doctor_id'])
            ->where('date', $newSchedule['date'])
            ->update(['shift' => FULLTIME_SHIFT]);
        }

        return response()->json(['message' => 'Schedule created successfully']);
    }

}