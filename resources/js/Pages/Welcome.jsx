import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MyCarousel from './UIGeneral/MyCarousel';
import React, { useState, useEffect } from 'react'
import GlobalFunctions from './services/GlobalFunctions';
import PojoProducto from './services/PojoProductos';
import SuggestedProducts from './UIGeneral/SuggestedProducts';
import Contact from './Contact/Contact';

export default function Welcome(params) {

    const glob = new GlobalFunctions()
    const [closeBtn, setCloseBtn] = useState(glob.getCookie('closeBtn'))

    useEffect(() => {
        checkCloseBtn()
        validarRedireccion()
    }, [])

    function validarRedireccion() {
        if (params.auth) {
            var variable = parseInt(glob.getCookie('productForCar'));
            if (isNaN(variable)) { } else {
                window.location.href = params.globalVars.thisUrl + 'product/' + glob.getCookie('productForCar')
                glob.setCookie('productForCar', '', -1)
            }
        }
    }

    function checkCloseBtn() {
        if (closeBtn == null || closeBtn == '') {
            setCloseBtn(0)
        }
        if (closeBtn >= 4) {
            setTimeout(() => {
                if (document.getElementById("divWhats") != null) {
                    closeWhats()
                }
            }, 4000);
        }
    }

    function activarHover(e) {
        document.getElementById(e + "divCategorias").style.boxShadow = '0px 15px 26px rgba(0, 0, 0, 0.50)'
        document.getElementById(e + "divCategorias").style['-webkit-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style['-moz-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style['-o-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style.transition = 'all 0.1s ease-in'
        document.getElementById(e + "divCategorias").style.marginTop = '10px'
    }

    function desactivarHover(e) {
        document.getElementById(e + "divCategorias").style.boxShadow = '0px 0px 0px rgba(0, 0, 0, 0.50)'
        document.getElementById(e + "divCategorias").style['-webkit-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style['-moz-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style['-o-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style.transition = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style.marginTop = '0px'
    }

    function closeWhats() {
        document.getElementById("divWhats").style.display = "none"
        document.getElementById("divFb").style.display = "none"
        let sumar = parseInt(closeBtn) + 1
        glob.setCookie('closeBtn', sumar, 3600 * 60 * 24)
    }

    function goFb() {
        window.open(params.info.linkfb, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }

    function goWhats() {
        let href = "https://api.whatsapp.com/send?phone=57" + params.info.telefonos[0].telefono + "&text=Hola! He visitado tu página y me gustaria preguntar algo!";
        window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }

    function goSisteCredito() {
        let href = "https://www.sistecredito.com/";
        window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }
    // Creación de arrays para mostrar resumen de productos por categorias
    let matrix = []
    let countCates = params.categorias.length
    for (let i = 0; i < countCates; i++) {
        let array = []
        for (let x = 0; x < params.productos.length; x++) {
            if (params.categorias[i].nombre == params.productos[x].categoria) {
                let pojo = new PojoProducto(params.productos[x].nombre, params.productos[x].id)
                pojo.setDescripcion(params.productos[x].descripcion)
                pojo.setImagen(params.productos[x].imagen.nombre_imagen)
                pojo.setValor(params.productos[x].valor)
                pojo.setRef(params.productos[x].referencia)
                array.push(pojo)
            }
        }
        let array1 = array.sort(() => Math.random() - 0.5)
        let array2 = []
        let nums = 0
        if (array1.length <= 12) {
            nums = array1.length
        } else {
            nums = 12
        }
        for (let r = 0; r < nums; r++) {
            array2.push(array1[r])
        }
        matrix[i] = array2
    }

    function goCategoria(cate) {
        window.location.href = params.globalVars.thisUrl + 'product/search/' + cate
    }

    return (
        <>
            <Head title="Welcome" />
            <AuthenticatedLayout user={params.auth} info={params.info} globalVars={params.globalVars} productos={params.productos} categorias={params.categorias} >
                <MyCarousel promos={params.promos} globalVars={params.globalVars}></MyCarousel>
                {/*Cards categorias*/}
                <br></br>
                <div className="container">
                    <h1 style={{ fontSize: '1.4em', padding: '0.5em' }} className='tituloCategorias rounded'>Categorias</h1>
                </div>
                <div style={{ marginTop: '0.2em' }} className="container">
                    <div className="row">
                        {params.categorias.map((item, index) => {
                            return (
                                <div style={{ marginTop: '1em', cursor: 'pointer' }} key={index} className='col-lg-4 col-md-6 col-sm-12 col-12 rounded'>
                                    <div onClick={() => goCategoria(item.nombre)} id={index + "divCategorias"} onTouchEnd={() => desactivarHover(index)} onTouchStart={() => activarHover(index)} className="card border border card-flyer pointer">
                                        <h4 style={{ marginTop: '0.5em', fontSize: '1.4em', textAlign: 'center', color: 'black' }} className="card-title superTitulo">
                                            {item.nombre}
                                        </h4>
                                        <img style={{ padding: '0.5em' }} className="card-img-top img-fluid rounded" src={params.globalVars.urlRoot + 'Images/Categories/' + item.imagen} alt="productos genial app" />
                                    </div>
                                </div>
                            )
                        })}
                        <br />
                    </div>
                    {/*Botones flotantes*/}
                    <div id='divFb' style={{ display: 'scroll', position: "fixed", bottom: '2%', left: '10%', zIndex: 1, cursor: 'pointer' }}>
                        <a onClick={closeWhats}><i className="fas fa-window-close"></i></a>
                        <h5 onClick={goFb}>Síguenos!</h5>
                        <img alt="" onClick={goFb} width="50" height="50" src={params.globalVars.urlRoot + 'Images/Config/btn_facebook.jpg'}></img>
                    </div>
                    <div id='divWhats' style={{ display: 'scroll', position: "fixed", bottom: '2%', right: '10%', zIndex: 1, cursor: 'pointer' }} >
                        <a onClick={closeWhats} ><i className="fas fa-window-close"></i></a>
                        <h5 onClick={goWhats} >Escribénos!</h5>
                        <img alt='' onClick={goWhats} src={params.globalVars.urlRoot + 'Images/Config/whatsApp_btn.png'}></img>
                    </div>
                    <br></br>
                    <div style={{ marginTop: '1em' }} id={"divEnvios"} onTouchEnd={() => desactivarHover('')} onTouchStart={() => activarHover('')} className="card-flyer rounded">
                        <h1 style={{ marginTop: 6, fontSize: '1.2em', padding: '1em' }} className="generalFontStyle">
                            Envios seguros y pagos contraentrega en el 90% del territorio colombiano con nuestras transportadoras aliadas:
                        </h1>
                        <img style={{ width: '29em', height: 'auto' }} className="card-img-top img-fluid centerImgCarousel" src={params.globalVars.urlRoot + 'Images/Config/envia.webp'} alt="" />
                        <img style={{ width: '29em', height: 'auto', padding: '0.5em' }} className="card-img-top img-fluid centerImgCarousel" src={params.globalVars.urlRoot + 'Images/Config/interrapidisimo.jpeg'} alt="" />
                    </div>
                    <br></br>
                    <div style={{ marginTop: '1em' }} id={"divEnvios"} onTouchEnd={() => desactivarHover('')} onTouchStart={() => activarHover('')} className="card-flyer rounded">
                        <h1 style={{ marginTop: 6, fontSize: '1.2em', padding: '1em' }} className="card-title generalFontStyle">
                            Pagos seguros con
                        </h1>
                        <img style={{ width: window.screen.width > 600 ? '30%' : '70%', height: 'auto' }} className="card-img-top img-fluid centerImgCarousel" src={params.globalVars.urlRoot + 'Images/Config/logowompi.png'} alt="" />
                    </div>
                    <br></br>
                    <div onClick={goSisteCredito} style={{ marginTop: '1em', padding: '2em' }} id={"divEnvios"} onTouchEnd={() => desactivarHover('')} onTouchStart={() => activarHover('')} className="card-flyer rounded">
                        <h1 style={{ marginTop: 6, fontSize: '1.2em' }} className="card-title generalFontStyle">
                            No esperes más para tenerlo, ¡Obtenlo ya con sistecrédito!
                        </h1>
                        <img style={{ width: window.screen.width > 600 ? '30%' : '70%', height: 'auto' }} className="card-img-top img-fluid centerImgCarousel" src={params.globalVars.urlRoot + 'Images/Config/sistecredito.png'} alt="" />
                    </div>
                </div>
                <br></br>
                <Contact url={params.globalVars.urlRoot} datos={params.info}></Contact>
            </AuthenticatedLayout>
        </>
    );
}
