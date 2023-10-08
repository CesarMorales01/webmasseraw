<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Response;
use App\Models\Globalvar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use stdClass;

class ProductController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new Globalvar();
    }

    public function index()
    {
        $auth = Auth()->user();
        $promos = DB::table('promociones_mercaya')->orderBy('id', 'desc')->get();
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $productos = DB::table('productos')->orderBy('id', 'desc')->get();
        foreach ($productos as $item) {
            if ($item->imagen != '') {
                $token = strtok($item->imagen, "||");
                $item->imagen = $token;
            } else {
                $imagen = DB::table('imagenes_productos')->where('fk_producto', '=', $item->id)->first();
                $item->imagen = $imagen->nombre_imagen; 
            } 
        }
        $categorias = DB::table('categorias')->get();
        return Inertia::render('Welcome', compact('auth', 'promos', 'info', 'globalVars', 'productos', 'categorias'));
    }

    public function product(string $id)
    {
        $auth = Auth()->user();
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $producto = DB::table('productos')->where('id', '=', $id)->first();
        $imagenes = DB::table('imagenes_productos')->where('fk_producto', '=', $id)->get();
        $list = [];
        foreach ($imagenes as $i) {
            $list[] = $i;
        }
        if ($producto->imagen != '') {
            $token = strtok($producto->imagen, "||");
            while ($token !== false) {
                $img = new stdClass();
                //LLenar con vacio porque al construir la ruta no debe ir ''
                $img->id = 'vacio';
                $img->nombre_imagen = $token;
                $list[] = $img;
                $token = strtok("||");
            }
        }
        $producto->imagen = $list;
        $productos = DB::table('productos')->orderBy('id', 'desc')->get();
        foreach ($productos as $item) {
            if ($item->imagen != '') {
                $obj = new stdClass();
                $obj->nombre_imagen = strtok($item->imagen, "||");
                $item->imagen = $obj;
            } else {
                $imagen = DB::table('imagenes_productos')->where('fk_producto', '=', $item->id)->first();
                $item->imagen = $imagen;
            }
        }
        $categorias = DB::table('categorias')->get();
        $token = csrf_token();
        return Inertia::render('Product/Product', compact('auth', 'info', 'globalVars', 'producto', 'categorias', 'productos', 'token'));
    }

    public function searchProduct(string $producto)
    {
        $auth = Auth()->user();
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $productos = DB::table('productos')->orWhere('nombre', 'like', '%' . $producto . '%')->orWhere('descripcion', 'like', '%' . $producto . '%')->orWhere('categoria', 'like', '%' . $producto . '%')->orderBy('id', 'desc')->get();
        foreach ($productos as $item) {
            $item->codigo = $item->id;
            if ($item->imagen != '') {
                $token = strtok($item->imagen, "||");
                $item->imagen = $token;
            } else {
                $imagen = DB::table('imagenes_productos')->where('fk_producto', '=', $item->id)->first();
                $item->imagen = $imagen->nombre_imagen; 
            }
        }
        $allproducts = DB::table('productos')->orderBy('id', 'desc')->get();
        foreach ($allproducts as $item) {
            if ($item->imagen != '') {
                $obj = new stdClass();
                $obj->nombre_imagen = strtok($item->imagen, "||");
                $item->imagen = $obj;
            } else {
                $imagen = DB::table('imagenes_productos')->where('fk_producto', '=', $item->id)->first();
                $item->imagen = $imagen;
            }
        }
        $categorias = DB::table('categorias')->get();
        return Inertia::render('Product/Search', compact('auth', 'info', 'globalVars', 'productos', 'allproducts', 'categorias', 'producto'));
    }
}
