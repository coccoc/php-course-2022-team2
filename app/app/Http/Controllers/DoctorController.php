<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class DoctorController extends Controller
{
    public function create(Request $request) :JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'bail|required',
            'email' => 'bail|required|email',
            'phone' => 'bail|required|numeric|digits:10',
            'password' => 'bail|required|min:8',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->add('error', 'true'));
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
            'status' => 2
        ]);
        return response()->json(['message' => 'Doctor created successfully']);
    }

    public function getById(Request $request, $id) :JsonResponse
    {
        $data = DB::table('doctor')->where('id', $id)->get();
        if (count($data) === 0) {
            return response()->json(['message' => 'Doctor not found'], 404);
        }
        $result = $data[0];
//        dd($result->id);
        return response()->json($result);
    }
}