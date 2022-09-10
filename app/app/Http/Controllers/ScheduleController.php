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
}