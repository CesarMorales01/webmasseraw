<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller
{
    public function questionsById(string $id){
        $preguntas=DB::table('preguntas_sobre_productos')->where('producto', '=', $id)->get();
        return response()->json($preguntas, 200, []); 
    }

    public function store(Request $request){
        $datos = json_decode(file_get_contents('php://input'));
        DB::table('preguntas_sobre_productos')->insert([
            'fecha'=>$datos->fecha,
            'cliente'=>Auth()->user()->email,
            'producto'=>$datos->producto,
            'pregunta'=>$datos->pregunta
        ]);
        return response()->json("ok", 200, []); 
    }
}
