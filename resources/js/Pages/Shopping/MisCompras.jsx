import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions'
import PojoProducto from '../services/PojoProductos'
import SuggestedProducts from '../UIGeneral/SuggestedProducts';
import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import '../../../css/general.css'

const MisCompras = (params) => {

    const glob = new GlobalFunctions()
    const [listaCompras, setListaCompras] = useState([])
    const [comprasPorEntregar, setComprasPorEntregar] = useState([])
    const [productoSugeridos, setProductosSugeridos] = useState([])

    useEffect(() => {
        validarComprasPorEntregar()
        if (params.listaCompras.length == 0) {
            functionSetProductosSugeridos()
        }
    }, [])

    function validarComprasPorEntregar() {
        let arrayEntregar = []
        let arrayCompras = []
        params.listaCompras.forEach(element => {
            if (element.estado != 'Entregada') {
                arrayEntregar.push(element)
            } else {
                arrayCompras.push(element)
            }
        });
        setComprasPorEntregar(arrayEntregar)
        setListaCompras(arrayCompras)
    }

    function numeroAleatorio() {
        return parseInt(Math.random() * (params.productos.length - 0) + 0)
    }

    function functionSetProductosSugeridos() {
        if (productoSugeridos.length == 0 && params.productos.length > 0) {
            // Creación de arrays para mostrar resumen de productos por categorias
            let array = []
            let num1 = 0;
            let num2 = 0;
            if (params.productos.length < 12) {
                num2 = params.productos.length
            } else {
                num1 = numeroAleatorio()
                num2 = num1 + 12
                if (num2 > params.productos.length) {
                    num1 = 0
                }
            }
            for (let x = num1; x < num2; x++) {
                let pojo = new PojoProducto(params.productos[x].nombre, params.productos[x].id)
                pojo.setImagen(params.productos[x].imagen.nombre_imagen)
                // darle formato al precio
                let precio_format = new Intl.NumberFormat("de-DE").format(params.productos[x].valor)
                pojo.setPrecio("$ " + precio_format)
                pojo.setRef(params.productos[x].referencia)
                array.push(pojo)
            }
            let array1 = array.sort(() => Math.random() - 0.5)
            let array2 = []
            let nums = 0
            if (array1.length <= 9) {
                nums = array1.length
            } else {
                nums = 9
            }
            for (let r = 0; r < nums; r++) {
                array2.push(array1[r])
            }
            setProductosSugeridos(array2)
        }
    }

    function check_estado_compra(estado) {
        const arraylist = []
        if (estado == "Recibida") {
            arraylist[0] = new PojoProducto('./Images/Config/check_box_verde.jpg', 'green')
            arraylist[1] = new PojoProducto('./Images/Config/unchecked_checkbox.png', '#c0c0c0')
            arraylist[2] = new PojoProducto('./Images/Config/unchecked_checkbox.png', '#c0c0c0')
            arraylist[3] = new PojoProducto('./Images/Config/unchecked_checkbox.png', '#c0c0c0')
        }
        if (estado == "Preparando") {
            arraylist[0] = new PojoProducto('./Images/Config/check_box_verde.jpg', 'green')
            arraylist[1] = new PojoProducto('./Images/Config/check_box_verde.jpg', 'green')
            arraylist[2] = new PojoProducto('./Images/Config/unchecked_checkbox.png', '#c0c0c0')
            arraylist[3] = new PojoProducto('./Images/Config/unchecked_checkbox.png', '#c0c0c0')
        }
        if (estado == "En camino") {
            arraylist[0] = new PojoProducto('./Images/Config/check_box_verde.jpg', 'green')
            arraylist[1] = new PojoProducto('./Images/Config/check_box_verde.jpg', 'green')
            arraylist[2] = new PojoProducto('./Images/Config/check_box_verde.jpg', 'green')
            arraylist[3] = new PojoProducto('./Images/Config/unchecked_checkbox.png', '#c0c0c0')
        }
        if (estado == "Entregada") {
            arraylist[0] = new PojoProducto('./Images/Config/check_box_verde.jpg', 'green')
            arraylist[1] = new PojoProducto('./Images/Config/check_box_verde.jpg', 'green')
            arraylist[2] = new PojoProducto('./Images/Config/check_box_verde.jpg', 'green')
            arraylist[3] = new PojoProducto('./Images/Config/check_box_verde.jpg', 'green')
        }
        return arraylist
    }

    function goWhats() {
        let href = "https://api.whatsapp.com/send?phone=057" + params.info.telefonos[0].telefono + "&text=Hola! Tengo un problema con mi compra!";
        window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }

    return (
        <>
            <Head title="Carrito de compras" />
            <AuthenticatedLayout user={params.auth} info={params.info} globalVars={params.globalVars} productos={params.productos} categorias={params.categorias}>
                <div style={{ display: comprasPorEntregar.length > 0 ? '' : 'none' }} className="container border border-success rounded">
                    <h1 id="titulo_producto" style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '0.2em', marginTop: '0.4em' }}>Seguimiento compra</h1>
                    {comprasPorEntregar.map((item, index) => {
                        const formatTotal = new Intl.NumberFormat("de-DE").format(item.total_compra)
                        let domi = '0'
                        if (isNaN(item.domicilio)) { } else {
                            domi = item.domicilio
                        }
                        const array = check_estado_compra(item.estado)
                        return (
                            <div style={{ textAlign: 'center' }} className='border rounded' key={index}>
                                <h5 id="tv_titulo_compra_n" style={{ textAlign: 'center', color: 'blue' }}>Compra N° {item.compra_n} del {item.fecha}</h5>
                                <h6 style={{ textAlign: 'justify' }}>Lista artículos</h6>
                                {item.productos.map((art, index) => {
                                    let img = 'Images/Config/producto_agotado.jpg'
                                    if (art.imagen != null) {
                                        img = 'Images/Products/' + art.imagen
                                    }
                                    const precio_format = new Intl.NumberFormat("de-DE").format(art.precio)
                                    return (
                                        <div key={index}>
                                            <div style={{ padding: '0.5vh' }} className="row align-items-center">
                                                {/*div img*/}
                                                <div className="col-2"  >
                                                    <img className="img-fluid rounded" style={{ height: '4.5em', width: '4em' }} src={params.globalVars.urlRoot + img} />
                                                </div>
                                                {/*div cant*/}
                                                <div className="col-1"  >
                                                    <h6>{art.cantidad}</h6>
                                                </div>
                                                {/*div titulo*/}
                                                <div className="col-6"  >
                                                    <h6 style={{ fontSize: '0.8em' }}>{art.producto}</h6>
                                                </div>
                                                {/*div precio*/}
                                                <div className="col-3" >
                                                    <h6>${precio_format}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <br />
                                <div id="div_subtotal" className="row justify-content-around">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12" >
                                        <h5 style={{ textAlign: 'center' }}>Total</h5>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12" >
                                        <h5 id="tv_subtotal" style={{ textAlign: 'center', color: 'blue' }}>$ {formatTotal}</h5>
                                    </div>
                                    <div style={{ display: 'none' }} className="col-lg-6 col-md-6 col-sm-6 col-12" >
                                        <h5 style={{ textAlign: 'center', color: 'gray' }}>Costo envio</h5>
                                    </div>
                                    <div style={{ display: 'none' }} className="col-lg-6 col-md-6 col-sm-6 col-12" >
                                        <h5 id="tv_costo_envio" style={{ textAlign: 'center', color: 'gray' }}>${domi}</h5>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12" >
                                        <h5 style={{ textAlign: 'center', color: 'gray' }}>Forma de pago</h5>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12" >
                                        <h5 id="tv_medio_de_pago" style={{ textAlign: 'center', color: 'blue' }}>{item.medio_de_pago}</h5>
                                    </div>
                                </div>
                                <br />
                                <div id="div_seguimiento_compra" className="row justify-content-around">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-12" >
                                        <div className="row justify-content-center">
                                            <div className="col-4">
                                                <img alt='' className='rounded' src={params.globalVars.urlRoot + array[0].nombre} style={{ height: '1.4em', width: '1.4em' }} />
                                            </div>
                                            <div className="col-8">
                                                <h6 style={{ color: array[0].codigo, textAlign: 'center' }}>Orden de compra recibida</h6>
                                            </div>
                                        </div>

                                        <div className="row justify-content-center">
                                            <div className="col-4">
                                                <img  alt='' className='rounded' src={params.globalVars.urlRoot + array[1].nombre} style={{ height: '1.4em', width: '1.4em' }} />
                                            </div>
                                            <div className="col-8">
                                                <h6 style={{ color: array[1].codigo, textAlign: 'center' }}>Preparando tus productos</h6>
                                            </div>
                                        </div>

                                        <div className="row justify-content-center">
                                            <div className="col-4">
                                                <img alt='' className='rounded' src={params.globalVars.urlRoot + array[2].nombre} style={{ height: '1.4em', width: '1.4em' }} />
                                            </div>
                                            <div className="col-8">
                                                <h6 style={{ color: array[2].codigo, textAlign: 'center' }}>Tu compra va en camino a casa</h6>
                                            </div>
                                        </div>

                                        <div className="row justify-content-center">
                                            <div className="col-4">
                                                <img alt='' className='rounded' src={params.globalVars.urlRoot + array[3].nombre} style={{ height: '1.4em', width: '1.4em' }} />
                                            </div>
                                            <div className="col-8">
                                                <h6 style={{ color: array[3].codigo, textAlign: 'center' }}>Compra entregada</h6>
                                            </div>
                                        </div>
                                        <br />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <br />
                <div className="container">
                    <h1 id="titulo_producto" style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '0.2em', textAlign: 'center' }}>{listaCompras.length > 0 ? 'Historial de compras' : ''}</h1>
                    {listaCompras.map((item, index) => {
                        return (
                            <div style={{ textAlign: 'center' }} key={index}>
                                {item.productos.map((art) => {
                                    const formatPrecio = new Intl.NumberFormat("de-DE").format(art.precio)
                                    let img = ''
                                    let disableBtn = false
                                    if (art.imagen != null) {
                                        img = '/Images/Products/' + art.imagen
                                    } else {
                                        disableBtn = true
                                        img = '/Images/Config/producto_agotado.jpg'
                                    }
                                    return (
                                        <div style={{ textAlign: 'center' }} key={art.codigo}>
                                            <div style={{ padding: '0.6vh' }} className="row align-items-center border rounded">
                                                {/*div fecha*/}
                                                <div className="col-lg-2 col-md-2 col-sm-12 col-12"  >
                                                    <h6>Entregada el {item.fecha}</h6>
                                                </div>
                                                {/*div cant*/}
                                                <div className="col-lg-2 col-md-2  col-sm-12  col-12"  >
                                                    <img alt='' src={params.globalVars.urlRoot + img} className="img-fluid rounded" style={{ height: '4.5em', width: '4em' }} />
                                                </div>
                                                {/*div titulo*/}
                                                <div className=" col-lg-4 col-md-4  col-sm-12 col-12"  >
                                                    <h5 style={{ fontSize: '0.8em' }}>{art.producto}</h5>
                                                    <h6 style={{ fontSize: '0.8em' }}>Cant: {art.cantidad}</h6>
                                                    <h6 style={{ fontSize: '0.8em' }}>c/u: ${formatPrecio}</h6>
                                                </div>
                                                {/*div precio*/}
                                                <div className="col-lg-4 col-md-4  col-sm-12  col-12" >
                                                    <a href={disableBtn ? '' : route('product.id', art.codigo)} style={{ width: '10em', height: '2.5em', backgroundColor: disableBtn ? 'gray' : 'green' }} disabled={disableBtn ? true : false} className={disableBtn ? 'btn btn-secondary' : 'btn btn-success'}>{disableBtn ? 'No disponible' : 'Volver a comprar'}</a>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                    <br />
                </div>
                <div onClick={goWhats} style={{ textAlign: 'center', display: listaCompras > 0 ? '' : 'none' }} className="container" >
                    <div className="row justify-content-center">
                        <div className="col-8">
                            <a className="btn btn-primary">Inquietudes? Escribenos!</a>
                        </div>
                        <div className="col-4">
                            <img alt='' className='rounded' style={{ width: '2em', cursor: 'pointer' }} src={params.globalVars.urlRoot + '/Imagenes_config/whatsapp1.png'} />
                        </div>
                    </div>
                </div>
                <br />
                {/* si no hay compras...*/}
                <div style={{ textAlign: 'center', marginTop: '4em', display: params.listaCompras.length > 0 ? 'none' : '' }}>
                    <div>
                        <h5>Aún no haz realizado compras!</h5>
                        <input type='hidden' id='Novedades' onClick={params.searchNovedades} />
                    </div>
                    <br /> <br /> <br /> <br />
                    <SuggestedProducts categoria='Prueba estos productos!' productos={productoSugeridos} globalVars={params.globalVars} />
                </div>
            </AuthenticatedLayout>
        </>

    )

}

export default MisCompras