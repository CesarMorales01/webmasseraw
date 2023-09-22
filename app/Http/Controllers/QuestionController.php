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
        DB::table('preguntas_sobre_productos')->insert([
            'fecha'=>$request->fecha,
            'cliente'=>$request->cliente,
            'nombre_usuario'=>Auth()->user()->name,
            'producto'=>$request->producto,
            'pregunta'=>$request->pregunta
        ]);
        return response()->json("ok", 200, []); 
    }
}
