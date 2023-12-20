<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Globalvar;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use stdClass;

class ShoppingController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new Globalvar();
    }

    public function create()
    {
        //Lista compras
        $auth = Auth()->user();

        $cedula = DB::table('keys')->where('email', '=', $auth->email)->first();
        $datosCliente = null;
        $listaCompras = [];
        if ($cedula->id_cliente != null) {
            $datosCliente = DB::table('clientes')->where('id', '=', $cedula->id_cliente)->first();
            $listaCompras = DB::table('lista_compras')->where('cliente', '=', $datosCliente->cedula)->get();
            foreach ($listaCompras as $item) {
                $productosComprados = DB::table('lista_productos_comprados')->where('cliente', '=', $datosCliente->cedula)->where('compra_n', '=', $item->compra_n)->get();
                $imagen = null;
                foreach ($productosComprados as $producto) {
                    $imagen = DB::table('imagenes_productos')->where('fk_producto', '=', $producto->codigo)->first();
                    if ($imagen != null) {
                        $producto->imagen = $imagen->nombre_imagen;
                    } else {
                        $prod = DB::table('productos')->where('id', '=', $producto->codigo)->first();
                        if ($prod != null) {
                            $producto->imagen = strtok($prod->imagen, "||");
                        }
                    }
                }
                $item->productos = $productosComprados;
            }
        }
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
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
        return Inertia::render('Shopping/MisCompras', compact('info', 'globalVars', 'productos', 'auth', 'categorias', 'listaCompras'));
    }

    public function registrarcompra(Request $request)
    {
        //Ingresar en lista de compras.
        $datos = json_decode(file_get_contents('php://input'));
        $get_compra_n = DB::table('lista_compras')->where('cliente', '=', $datos->cliente->cedula)->orderBy('id', 'desc')->pluck('compra_n');
        $compra_n = 1;
        if (count($get_compra_n) > 0) {
            $compra_n = $compra_n + $get_compra_n[0];
        }
        $medioPago = $datos->formaPago;
        if ($datos->referenciaWompi != '') {
            $medioPago = "Pago electronico. Proceso iniciado.";
        }
        $lista = DB::table('lista_compras')->insert([
            'cliente' => $datos->cliente->cedula,
            'compra_n' => $compra_n,
            'fecha' => $datos->fecha,
            'total_compra' => $datos->totales->subtotal,
            'domicilio' => $datos->totales->envio,
            'medio_de_pago' => $medioPago,
            'costo_medio_pago' => $datos->totales->formatMedioPago,
            'comentarios' => $datos->comentarios,
            'estado' => 'Recibida',
            //Como no se usa el cambio en los pagos por la web se puede usar para guardar la ref del pago rompi...
            'dinerorecibido' => $datos->referenciaWompi
        ]);
        $productos = $this->ingresarProductosComprados($datos, $compra_n);
        if ($productos > 0 && $datos->referenciaWompi == '') {
            DB::table('carrito_compras_casabonita')->where('cliente', '=', Auth()->user()->email)->delete();
        }
        return response()->json($productos, 200, []);
    }

    public function ingresarProductosComprados($datos, $compra_n)
    {
        $nums = null;
        foreach ($datos->productos as $item) {
            DB::table('lista_productos_comprados')->insert([
                'cliente' => $datos->cliente->cedula,
                'compra_n' => $compra_n,
                'codigo' => $item->cod,
                'producto' => $item->producto,
                'cantidad' => $item->cantidad,
                'precio' => $item->valor
            ]);
            $this->restarInventario($item);
            $nums++;
        }
        return $nums;
    }

    public function restarInventario($item)
    {
        $actualCant = DB::table('productos')->where('id', '=', $item->cod)->first();
        if ($actualCant->cantidad != null) {
            $newCant = $actualCant->cantidad - $item->cantidad;
            DB::table('productos')->where('id', '=', $item->cod)->update([
                'cantidad' => $newCant
            ]);
        }
    }

    public function store(Request $request)
    {
        $user = Auth()->user();
        $carrito = DB::table('carrito_compras_casabonita')->where('cliente', '=', $user->email)->get();
        $cant = $request->cantidad;
        if (count($carrito) > 0) {
            foreach ($carrito as $item) {
                if ($item->cod == $request->codigo) {
                    $cant = $cant + $item->cantidad;
                }
            }
            if ($cant !== $request->cantidad) {
                DB::table('carrito_compras_casabonita')->where('cliente', '=', $user->email)->where('cod', '=', $request->codigo)->update([
                    'valor' => $request->valor,
                    'cantidad' => $cant,
                    'fecha' => $request->fecha
                ]);
            } else {
                $this->insertarCarrito($request);
            }
        } else {
            $this->insertarCarrito($request);
        }
        return Redirect::route('shopping.edit', $user->email);
    }

    public function insertarCarrito(Request $request)
    {
        DB::table('carrito_compras_casabonita')->insert([
            'cod' => $request->codigo,
            'producto' => $request->nombre,
            'imagen' => $request->imagen,
            'valor' => $request->valor,
            'cantidad' => $request->cantidad,
            'cliente' => Auth()->user()->email,
            'fecha' => $request->fecha
        ]);
    }

    public function show(string $id)
    {
        if ($id == 'checkout') {
            // Al recargar la pagina se carga get en vez de post shopping/checkout.
            return Redirect::route('shopping.edit', Auth()->user()->email);
        } else {
            //Muestra el numero de articulos en el icono de carrito de compras en navbar
            $carrito = DB::table('carrito_compras_casabonita')->where('cliente', '=', $id)->get();
            return response()->json($carrito, 200, []);
        }
    }

    public function edit(string $id)
    {
        $auth = Auth()->user();
        $cedula = DB::table('keys')->where('email', '=', $auth->email)->first();
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
        $info = DB::table('info_pagina')->first();
        $telefonosPagina = DB::table('telefonos_pagina')->get();
        $info->telefonos = $telefonosPagina;
        $globalVars = $this->global->getGlobalVars();
        $productos = DB::table('productos')->orderBy('id', 'desc')->get();
        foreach ($productos as $item) {
            if ($item->imagen != '') {
                $item->imagen = strtok($item->imagen, "||");
            } else {
                $imagen = DB::table('imagenes_productos')->where('fk_producto', '=', $item->id)->first();
                $item->imagen = $imagen->nombre_imagen;
            }
        }
        $carrito = DB::table('carrito_compras_casabonita')->where('cliente', '=', $id)->get();
        $deptos = DB::table('departamentos')->get();
        $municipios = DB::table('municipios')->get();
        $categorias = DB::table('categorias')->get();
        $token = csrf_token();
        return Inertia::render('Shopping/Shopping', compact('info', 'globalVars', 'productos', 'auth', 'carrito', 'datosCliente', 'municipios', 'deptos', 'categorias', 'token'));
    }

    public function eliminar(string $id)
    {
        DB::table('carrito_compras_casabonita')->where('cliente', '=', Auth()->user()->email)->where('cod', '=', $id)->delete();
        $carrito = DB::table('carrito_compras_casabonita')->where('cliente', '=', Auth()->user()->email)->get();
        return response()->json($carrito, 200, []);
    }

    public function actualizarCarrito(string $cod, string $cant)
    {
        DB::table('carrito_compras_casabonita')->where('cliente', '=', Auth()->user()->email)->where('cod', '=', $cod)->update([
            'cantidad' => $cant
        ]);
        $carrito = DB::table('carrito_compras_casabonita')->where('cliente', '=', Auth()->user()->email)->get();
        return response()->json($carrito, 200, []);
    }

    public function getRefWompi($ced, $total, $fecha)
    {
        DB::table('pagos_wompi_casabonita')->insert([
            'cliente' => $ced,
            'valor_compra' => $total,
            'fecha' => $fecha,
            'estado' => 'Iniciada'
        ]);
        $obj = new stdClass();
        $obj->ref_wompi = DB::getPdo()->lastInsertId();
        date_default_timezone_set("America/Bogota");
        $mifecha = date('Y-m-d H:i:s');
        $NuevaFecha = strtotime('+2 hour', strtotime($mifecha));
        $NuevaFecha = date('Y-m-d H:i:s', $NuevaFecha);
        $integrity = 'test_integrity_rDlK51wv8YHbRufJtgqJUAvu13QEYqqh';
        $obj->secretoInt = hash("sha256", $obj->ref_wompi . $total . 'COP' . $NuevaFecha . $integrity);
        return response()->json($obj, 200, []);
    }

    public function checkPay(Request $request)
    {
        $id = $request->id;
        $globalVars = $this->global->getGlobalVars();
        $auth = Auth()->user();
        return Inertia::render('Shopping/ValidarPago', compact('id', 'globalVars', 'auth'));
    }

    public function gestionEventos(Request $request)
    {
        http_response_code(200);
        $datos = json_decode(file_get_contents('php://input'));
        $estado = $datos->data->transaction->status;
        DB::table('pagos_wompi_casabonita')->where('id', '=', $datos->data->transaction->reference)->update([
            'ref_wompi' => $datos->data->transaction->id,
            'estado' => $estado
        ]);
        DB::table('lista_compras')->where('dinerorecibido', '=', $datos->data->transaction->reference)->update([
            'dinerorecibido' => '',
            'medio_de_pago' => 'Pago wompi: ' . $estado . '. Ref: ' . $datos->data->transaction->id
        ]);
        if ($estado=='APPROVED') {
            DB::table('carrito_compras_casabonita')->where('cliente', '=', $datos->data->transaction->shipping_address->address_line_1)->delete();
        }
    }
}
