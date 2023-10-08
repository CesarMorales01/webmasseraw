import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions'
import { useState, useEffect } from 'react';
import PojoProducto from '../services/PojoProductos'
import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Swal from 'sweetalert2';
import SuggestedProducts from '../UIGeneral/SuggestedProducts'
import '../../../css/general.css'
import CheckOut from './Checkout';

const ShoppingCart = (params) => {

    const glob = new GlobalFunctions()
    const [products, setProducts] = useState(params.carrito)
    const [totales, setTotales] = useState({
        subtotal: 0,
        formatSubtotal: 0,
        envio: 0,
        formatEnvio: 0,
        totalConEnvio: 0,
        formatTotalConEnvio: 0,
        medioPago: 0,
        formatMedioPago: 0,
        totalConMedioDePago: 0,
        formatTotalConMedioPago: 0
    })
    const [productoSugeridos, setProductosSugeridos] = useState([])
    const [modoPago, setModoPago] = useState('contraentrega')
    const [checkOut, setCheckOut] = useState(false)

    useEffect(() => {
        if (products.length > 0) {
            calcularTotales()
        } else {
            functionSetProductosSugeridos()
        }
    }, [products, modoPago])

    function alertCiudad(mensaje) {
        Swal.fire({
            title: mensaje,
            text: "¿Modificar ciudad?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, ir a mi perfil'
        }).then((result) => {
            if (result.isConfirmed) {
                goProfile()
            }
        })
    }

    function alertCiudadTimeOut(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
        })
    }

    function goProfile() {
        const exp = 3600 * 24 * 365
        glob.setCookie('comeBackCarrito', true, exp)
        window.location.href = params.globalVars.thisUrl + "profile/" + params.auth.email
    }

    function alertEliminar(cod, producto, index) {
        Swal.fire({
            title: '¿Eliminar ' + producto + ' ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, eliminar.'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById(index).style.display = ''
                borrar(cod, index)
            }
        })
    }

    function borrar(cod, index) {
        const url = params.globalVars.thisUrl + 'shopping/eliminar/producto/' + cod
        fetch(url).then((response) => {
            return response.json()
        }).then((json) => {
            document.getElementById(index).style.display = 'none'
            setProducts(json)
        })
    }

    function menosCant(id, cant, index) {
        if (cant > 1) {
            document.getElementById(index).style.display = ''
            const cant1 = parseInt(cant) - 1
            actualizarCarrito(id, cant1, index)
        }
    }

    function masCant(id, cant, index) {
        let findProduct = null;
        params.productos.forEach(element => {
            if (element.id == id) {
                findProduct = element
            }
        });
        if (findProduct.cantidad != null) {
            if (findProduct.cantidad < parseInt(cant) + 1) {
                return
            } else {
                setCant(id, cant, index)
            }
        } else {
            setCant(id, cant, index)
        }
    }

    function setCant(id, cant, index) {
        if (cant < 6) {
            document.getElementById(index).style.display = ''
            const cant1 = parseInt(cant) + 1
            actualizarCarrito(id, cant1, index)
        }
    }

    function actualizarCarrito(id, cant, index) {
        const url = params.globalVars.thisUrl + 'shopping/' + id + "/" + cant
        fetch(url).then((response) => {
            return response.json()
        }).then((json) => {
            document.getElementById(index).style.display = 'none'
            setProducts(json)
        })
    }

    function calcularTotales() {
        // ciudad envio llega vacio!!!
        if (params.datosCliente.ciudad != null) {
            let sub = 0
            products.map((item) => {
                sub = sub + parseInt(item.valor) * item.cantidad
            })
            // subtotal
            let formatSub = new Intl.NumberFormat("de-DE").format(sub)
            // envio
            if (params.datosCliente.ciudad != null) {
                let formatEnvio = new Intl.NumberFormat("de-DE").format(totalizarCostoEnvio(sub))
                let formatTotalConEnvio = new Intl.NumberFormat("de-DE").format(parseFloat(totalizarCostoEnvio(sub)) + sub)
                // modo de pago
                let formatMedioPago = new Intl.NumberFormat("de-DE").format(Math.round(totalizarModoDepago(sub)))
                // suma de subtotal+ envio + medio de pago
                let totalEnvioMasMedioPago = Math.round(parseFloat(sub) + parseFloat(totalizarModoDepago(sub)) + parseFloat(totalizarCostoEnvio(sub)))
                let formatTotalConMedioDePago = new Intl.NumberFormat("de-DE").format(totalEnvioMasMedioPago)
                setTotales({
                    ...totales,
                    subtotal: sub,
                    formatSubtotal: formatSub,
                    envio: totalizarCostoEnvio(sub),
                    formatEnvio: formatEnvio,
                    totalConEnvio: parseInt(totalizarCostoEnvio(sub)) + parseInt(sub),
                    formatTotalConEnvio: formatTotalConEnvio,
                    medioPago: totalizarModoDepago(sub),
                    formatMedioPago: formatMedioPago,
                    totalConMedioDePago: totalEnvioMasMedioPago,
                    formatTotalConMedioPago: formatTotalConMedioDePago
                })
            }
        } else {
            alertCiudad('No se ha encontrado la ciudad de envio!')
        }
    }

    function cambiarModoPago(metodo) {
        if (metodo == 'electronico') {
            setModoPago(metodo)
        } else {
            setModoPago('contraentrega')
        }
    }

    function totalizarModoDepago(subtotal) {
        setCheckedRadioPagos()
        let costoModoPago = 0;
        if (modoPago == 'contraentrega' & params.info.valor_pago_contraentrega != null) {
            costoModoPago = parseFloat(params.info.valor_pago_contraentrega)
        } else {
            costoModoPago = (parseFloat(params.info.comision_pasarela_pagos) / 100) * parseFloat(subtotal)
        }
        return costoModoPago;
    }

    function setCheckedRadioPagos() {
        if (modoPago == 'contraentrega') {
            document.getElementById('contraentrega').checked = true
            document.getElementById('wompi').checked = false
        } else {
            document.getElementById('wompi').checked = true
            document.getElementById('contraentrega').checked = false
        }
    }

    function totalizarCostoEnvio(subto) {
        let envio = 0;
        let ciudadEnvio = getNombreCiudad(params.datosCliente.ciudad);
        if (ciudadEnvio.toUpperCase() == 'BUCARAMANGA' || ciudadEnvio.toUpperCase() == 'GIRON' || ciudadEnvio.toUpperCase() == 'FLORIDABLANCA') {
            if (subto > 100000) {
                envio = 0
            } else {
                if (params.info.valor_envio != null) {
                    envio = params.info.valor_envio
                }
            }
        } else {
            if (params.info.valor_envio != null) {
                envio = params.info.valor_envio
            }
        }
        return envio
    }

    function getNombreCiudad(codigoCiudad) {
        let nombreCiudad = ''
        for (let i = 0; i < params.municipios.length; i++) {
            if (params.municipios[i].id == codigoCiudad) {
                nombreCiudad = params.municipios[i].nombre
            }
        }
        return nombreCiudad
    }

    function goWhats() {
        let href = "https://api.whatsapp.com/send?phone=57" + params.info.telefonos[0].telefono + "&text=Hola! Tengo un problema con mi carrito de compras!";
        window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }

    function cargarInfoToPay() {
        if (params.datosCliente.ciudad != null) {
            setTimeout(() => {
                setCheckOut(true)
            }, 100);
        } else {
            // cookie para redireccionar despues de actualizar profile....
            alertCiudadTimeOut('No se ha encontrado la ciudad de envio!')
            setTimeout(() => {
                goProfile()
            }, 1500);
        }
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
                pojo.setImagen(params.productos[x].imagen)
                pojo.setValor(params.productos[x].valor)
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

    return (
        <>
            <div style={{ display: checkOut ? 'none' : '' }}>
                <Head title="Carrito de compras" />
                <AuthenticatedLayout user={params.auth} info={params.info} globalVars={params.globalVars} productos={params.productos} categorias={params.categorias}>
                    {products.length > 0 ?
                        <div className='container'>

                            <div className="row" style={{ color: 'green', }}>
                                <div className="align-self-center">
                                    <h5 style={{ fontSize: '1.4em', fontWeight: 'bold', textAlign: 'center', marginTop: '0.4em', marginBottom: '0.4em' }} >Carrito de compras</h5>
                                </div>
                            </div>
                            <div className='container'>
                                <div className="row">
                                    <div className="col-lg-9 col-md-9 col-sm-12 col-12 border border-success rounded">
                                        {products.map((item, index) => {
                                            const precio = parseInt(item.valor) * item.cantidad
                                            let precio_format = new Intl.NumberFormat("de-DE").format(precio)
                                            return (
                                                <div key={index} >
                                                    <div style={{ padding: '0.5vh' }} className="row align-items-center">
                                                        {/*div img*/}
                                                        <div className="col-2"  >
                                                            <img className="img-fluid rounded" style={{ height: '4.5em', width: '4em' }} src={params.globalVars.urlRoot + 'Images/Products/' + item.imagen} />
                                                        </div>
                                                        {/*div titulo*/}
                                                        <div className="col-7"  >
                                                            <h6 style={{ fontSize: '0.8em' }}>{item.producto}</h6>
                                                        </div>
                                                        {/*div precio*/}
                                                        <div className="col-3" >
                                                            <h6>${precio_format}</h6>
                                                        </div>
                                                    </div>
                                                    <div style={{ padding: '0.5vh' }} className='row justify-content-between'>
                                                        <div style={{ marginLeft: '1em' }} className='col-2'>
                                                            <button id={index} style={{ display: 'none', backgroundColor: 'gray' }} className="btn btn-primary btn-sm" type="button" disabled>
                                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            </button>
                                                        </div>
                                                        <div className='col-4'>
                                                            {/*div cant*/}
                                                            <div style={{ alignItems: 'center' }} className="row">
                                                                <div style={{ marginBottom: '0.1em' }} onClick={() => menosCant(item.cod, item.cantidad, index)} className="col-lg-4 col-md-4 col-sm-4 col-4 cursorPointer">
                                                                    <button type='button' className="btn btn-light btn-sm"><i className="fas fa-minus fa-sm"></i></button>
                                                                </div>
                                                                <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                                                    <h5 style={{ color: 'green', marginLeft: '0.5em' }}>{item.cantidad}</h5>
                                                                </div>
                                                                <div style={{ marginBottom: '0.1em' }} onClick={() => masCant(item.cod, item.cantidad, index)} className="col-lg-4 col-md-4 col-sm-4 col-4 cursorPointer">
                                                                    <button type='button' className="btn btn-light btn-sm"><i className="fas fa-plus fa-sm"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div onClick={() => alertEliminar(item.cod, item.producto, index)} className='col-2'>
                                                            <button className='btn btn-danger btn-sm'><img style={{ height: '1em', width: '1em', cursor: 'pointer' }} src={params.globalVars.urlRoot + 'Images/Config/trash.png'} /></button>
                                                        </div>
                                                    </div>
                                                    <hr style={{ height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }}></hr>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div style={{ textAlign: 'center' }} className="col-lg-3 col-md-3 col-sm-12 col-12 border border-success rounded">
                                        <h6 style={{ textAlign: 'center', marginTop: '0.4em' }}>Subtotal</h6>
                                        <h6 style={{ color: 'green', textAlign: 'center', marginTop: '0.4em' }}>$ {totales.formatSubtotal}</h6>
                                        <hr style={{ height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray', marginTop: '0.4em' }}></hr>
                                        <h6 style={{ marginTop: '0.2em', marginBottom: '0.3em' }}><strong>El valor del envío te lo damos en la confirmación del pedido</strong></h6>
                                        <h6 style={{ color: 'green', textAlign: 'center', display: 'none' }}>$ {totales.formatTotalConEnvio}</h6>
                                        <hr style={{ height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }}></hr>
                                        <h6 style={{ marginTop: '0.6em' }}>Elije el medio de pago:</h6>
                                        <div style={{ padding: '1vh', marginTop: '0.6em', cursor: 'pointer' }} className="container card" >
                                            <div onClick={() => cambiarModoPago('contraentrega')} className="row align-items-center ">
                                                <label style={{ textAlign: 'center' }}>Contraentrega. Lo pagas en la puerta de tu casa</label>
                                                <div className="col-4">
                                                    <input type="radio" id="contraentrega" name="medio_pago" value="contraentrega" />
                                                </div>
                                                <div className="col-8">
                                                    <img style={{ width: '50%', height: 'auto' }} src={params.globalVars.urlRoot + 'Images/Config/contraentregaico.jpg'} />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ padding: '1vh', marginTop: '0.2em', cursor: 'pointer' }} className="container card" >
                                            <div onClick={() => cambiarModoPago('electronico')} className="row align-items-center">
                                                <label style={{ textAlign: 'center', cursor: 'pointer' }}>Pago en linea. Comisión del 3.5% sobre el valor de la compra</label>
                                                <div className="col-4">
                                                    <input type="radio" id="wompi" name="medio_pago" value="wompi" />
                                                </div>
                                                <div className="col-8">
                                                    <img style={{ width: '60%', height: 'auto' }} src={params.globalVars.urlRoot + 'Images/Config/wompi_btn.png'} />
                                                </div>
                                            </div>
                                        </div>
                                        <h6 style={{ textAlign: 'center', marginTop: '0.2em' }}>Costo medio de pago</h6>
                                        <h6 style={{ color: 'green', textAlign: 'center' }}>$ {totales.formatMedioPago}</h6>
                                        <br />
                                        <h5 style={{ textAlign: 'center' }}>Total a pagar</h5>
                                        <h5 style={{ color: 'green', textAlign: 'center' }}>$ {totales.formatTotalConMedioPago}</h5>
                                        <button type='button' id='btnPagar' onClick={cargarInfoToPay} style={{ fonSize: '18px', backgroundColor: 'green', textAlign: 'center', marginTop: '0.6em' }} className="btn btn-primary btn-lg">Ir a pagar</button>
                                        <button id='btnPagarLoading' style={{ display: 'none', backgroundColor: 'green', marginTop: '0.6em' }} className="btn btn-primary" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </button>
                                        <br /><br />
                                    </div>

                                </div>
                                <br />
                            </div>
                            <div className="container">
                                <div className="row justify-content-between">
                                    <div className="col-3">
                                        <a href={route('index')} style={{ fontSize: '1em', backgroundColor: '#f0e094', color: 'green', width: '14em' }} className="card btn btn-primary"><strong>Continuar comprando</strong></a>
                                    </div>
                                    <div onClick={goWhats} style={{ cursor: 'pointer' }} className="col-3">
                                        <strong>Dudas? </strong>
                                        <img style={{ width: '2em' }} src={params.globalVars.urlRoot + 'Images/Config/whatsApp_btn.png'} />
                                    </div>
                                </div>
                                <br />
                                <p style={{ fontSize: '0.8em' }}><strong style={{ color: 'red' }}>*</strong>La disponibilidad, el precio y la cantidad de unidades de los productos esta sujeta a las unidades disponibles en inventario.
                                    {params.info.nombre} no se hace responsable por el posible agotamiento de unidades.</p>
                            </div>
                            <br />


                        </div>
                        :
                        <div style={{ textAlign: 'center', marginTop: '4em' }}>
                            <div style={{ padding: '1em' }}>
                                <h5>Tu carrito esta vacío!</h5>
                                <a href={route('product.search', params.categorias[0].nombre)} style={{ marginTop: '1em' }} type="button" className="btn btn-outline-success">Presiona aquí para ver muchas super novedades!!!</a>
                            </div>
                            <br /> <br /> <br /> <br />
                            <div >
                                <SuggestedProducts categoria='Prueba estos productos!' productos={productoSugeridos} globalVars={params.globalVars} />
                            </div>
                        </div>
                    }
                </AuthenticatedLayout>
            </div>
            <div style={{ display: checkOut ? '' : 'none' }}>
                {params.datosCliente != null ?
                    <CheckOut totales={totales} info={params.info} globalVars={params.globalVars} datosCliente={params.datosCliente} productos={products} deptos={params.deptos} municipios={params.municipios} modoPago={modoPago} auth={params.auth} token={params.token}></CheckOut>
                    : ''}

            </div>
        </>
    )

}

export default ShoppingCart