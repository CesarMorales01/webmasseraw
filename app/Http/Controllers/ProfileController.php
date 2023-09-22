<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Models\Globalvar;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use stdClass;

class ProfileController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new Globalvar();
    }

    public function edit(string $email, string $message = '')
    {
        $auth = Auth()->user();
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $productos = DB::table('productos')->orderBy('id', 'desc')->get();
        $cedula = DB::table('keys')->where('email', '=', $auth->email)->first();
        $auth->clave = $cedula->password;
        $datosCliente = null;
        if ($cedula->id_cliente != null) {
            $datosCliente = DB::table('clientes')->where('id', '=', $cedula->id_cliente)->first();
            $telefonos = DB::table('telefonos_clientes')->where('cedula', '=', $cedula->id_cliente)->get();
            $tels = [];
            if ($telefonos != null) {
                foreach ($telefonos as $tel) {
                    $tels[] = $tel->telefono;
                }
            } else {
                if ($datosCliente->telefono != '') {
                    $objeTel = new stdClass();
                    $objeTel->id = '';
                    $objeTel->cedula = $datosCliente->cedula;
                    $objeTel->telefono = $datosCliente->telefono;
                    $tels[] = $objeTel;
                }
            }
            $datosCliente->telefonos = $tels;
        }
        $token = csrf_token();
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $categorias = DB::table('categorias')->get();
        return Inertia::render('Profile/MyProfile', compact('info', 'globalVars', 'productos', 'auth', 'datosCliente', 'token', 'deptos', 'municipios', 'message', 'categorias'));
    }

    public function update(Request $request)
    {
        $contra = '';
        if (strlen($request->clave) == 60) {
            $contra = $request->clave;
        } else {
            $contra = Hash::make($request->clave);
        }
        DB::table('keys')->where('id_cliente', '=', $request->id)->update([
            'name' => $request->usuario,
            'email' => $request->correo,
            'id_cliente' => $request->id,
            'password' => $contra
        ]);
        $this->ingresar_telefonos($request);
        DB::table('clientes')->updateOrInsert(
            ['id' => $request->id],
            [
                'nombre' => $request->nombre,
                'apellidos' => $request->apellidos,
                'cedula' => $request->cedula,
                'direccion' => $request->direccion,
                'info_direccion' => $request->info_direccion,
                'ciudad' => $request->codCiudad,
                'departamento' => $request->codDepto,
                'telefono'=>'',
                'email' => '',
                'nombre_usuario' => '',
                'clave' => ''
            ]
        );
        return Redirect::route('profile.edit', array('email' => $request->correo, 'message' => 'Datos actualizados!'));
    }

    public function ingresar_telefonos($request)
    {
        DB::table('telefonos_clientes')->where('cedula', '=', $request->id)->delete();
        for ($i = 0; $i < count($request->telefonos); $i++) {
            $token = strtok($request->telefonos[$i], ",");
            while ($token !== false) {
                DB::table('telefonos_clientes')->insert([
                    'cedula' => $request->id,
                    'telefono' => $token
                ]);
                $token = strtok(",");
            }
        }
    }

    public function destroy(Request $request)
    {
        return response()->json($request, 200, []);
    }

    public function checkpass(string $correo, string $clave)
    {
        $user = DB::table('keys')->where('email', '=', $correo)->first();
        $validar = Hash::check($clave, $user->password);
        return response()->json($validar, 200, []);
    }
}
