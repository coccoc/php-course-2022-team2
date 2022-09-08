<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{
    public function create(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'bail|required',
            'email' => 'bail|required|email',
            'phone' => 'bail|required|numeric|digits:10',
            'password' => 'bail|required|min:8',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), HTTP_BAD_REQUEST);
        }
        $data = [
            "name" => $request->input('name', null),
            "email" => $request->input('email', null),
            "phone" => $request->input('phone', null),
            "password" => $request->input('password', null),
        ];
        DB::table('doctor')->insert([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => $data['password'],
            'status' => STATUS_ON
        ]);
        return response()->json(['message' => 'Doctor created successfully']);
    }

    public function getById(Request $request, $id): JsonResponse
    {
        $data = DB::table('doctor')->where('id', $id)->get();
        if (count($data) === 0) {
            return response()->json(['message' => 'Doctor not found'], HTTP_NOT_FOUND);
        }
        $result = $data[0];
//        dd($result->id);
        return response()->json($result);
    }

    public function Search(Request $request): JsonResponse
    {
        $dataSearch = [
            "id" => $request->input('id', null),
            "name" => $request->input('name', null),
        ];
        $dataSearch = array_filter($dataSearch);
//        dd($dataSearch);
        $data = DB::table('doctor')->where($dataSearch)->get();
//        if (count($data) === 0) {
//            return response()->json(['message' => 'Doctor not found'], HTTP_NOT_FOUND);
//        }
        return response()->json($data);
    }
    public function list(Request $request): JsonResponse{
        //dd(1);
        $data = DB::table('doctor')->get();
        //dd($data);
        if (count($data) === 0) {
            return response()->json(['message' => 'Doctor not found'], HTTP_NOT_FOUND);
        }
        $result = $data;

        return response()->json($result);
    }
    public function doctorDetail(Request $request, $id): JsonResponse{
        $data = DB::table('doctor')
                ->where('doctor.id', $id)
                ->join('schedule', 'schedule.doctor_id', '=', 'doctor.id')
                ->get(['doctor.*', 'schedule.*']);
        if (count($data) === 0){
            return response()->json(['message'=>'Doctor not found'], HTTP_NOT_FOUND);
        }
        $result = $data;
        return response()->json($result);
    }
}

