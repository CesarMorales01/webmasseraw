import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import Swal from 'sweetalert2';

const Questions = (params) => {
    const glob = new GlobalFunctions()
    const [mensaje, setMensaje] = useState('')
    const [preguntas, setPreguntas] = useState([])

    useEffect(() => {
        if (preguntas.length == 0) {
            fetchGetQuestion()
        }
    }, [preguntas])

    function fetchGetQuestion() {
        const url = params.globalVars.thisUrl + 'question/' + params.producto.id
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                setPreguntas(json)
            })
    }

    function goWhats() {
        let href = "https://api.whatsapp.com/send?phone=057" + params.info.telefonos[0].telefono + "&text=Hola! Quiero preguntar sobre" + params.producto.nombre;
        window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }

    function preguntar_sobre(msje) {
        setMensaje(msje)
        document.getElementById("tv_preguntar").style.backgroundColor = "#f0e094";
        document.getElementById("btnPreguntar").style.backgroundColor = "green";
    }

    function sweetAlert(mensaje) {
        Swal.fire({
            title: mensaje,
            icon: 'warning',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
        })
    }

    function check_pregunta() {
        if (params.auth) {
            if (mensaje == '') {
                sweetAlert("Escribe una pregunta!")
            } else {
                fetchRegistrarPregunta()
            }
        } else {
            // guardo una cookie para cuando no hay sesion iniciada, y una vez hecha retornar al product
            glob.setCookie('productForCar', params.producto.id, 3600)
            sweetAlert("Debes identificarte para preguntar!")
            setTimeout(() => {
                window.location.href = params.globalVars.thisUrl + 'log'
            }, 1500);

        }
    }

    function loadingOn() {
        document.getElementById('btnPreguntar').style.display = 'none'
        document.getElementById('botonLoading').style.display = 'inline'
    }

    function loadingOff() {
        document.getElementById('btnPreguntar').style.display = 'inline'
        document.getElementById('botonLoading').style.display = 'none'
    }
   
    function fetchRegistrarPregunta() {
        const url = params.globalVars.thisUrl + "question?_token=" + params.token
        let info = {
            fecha: glob.getFecha(),
            pregunta: mensaje,
            producto: params.producto.id
        }
        loadingOn()
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(info),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((res) => {
            if (res == 'ok') {
                //Enviar correo cuando haya una pregunta
                let message = 'Ingresa para contestar a ' + params.globalVars.urlRoot + 'question'
                let correo=params.info.correo
                const enlace = params.globalVars.thisUrl + 'mail.php?app=' + params.globalVars.thisUrl + "&to=" + correo + "&message=" + message + "&subject=Nueva pregunta sobre producto! "
                fetch(enlace)
                    .then((response) => {
                        return response.json()
                    }).then((json) => {
                        console.log(json)
                    })
            }
            loadingOff()
            recargarPreguntas()
        })
    }

    function recargarPreguntas() {
        const array = []
        setPreguntas(array)
    }

    function functionSetMensaje(event) {
        setMensaje(event.target.value)
    }

    return (
        <div style={{ marginTop: '1em', marginBottom: '1em' }} className='container'>
            <div className="row cursorPointer textAlignCenter" >
                <div style={{ margin: '2px' }} className="col-12 col-sm-4 col-md-3 col-lg-2">
                    <h2 className='fontSizePreciosSuggested'>Pregunta sobre este producto</h2>
                </div>
                <div style={{ margin: '2px' }} className="col-12 col-sm-3 col-md-3 col-lg-2">
                    <a onClick={() => preguntar_sobre('Tiene costo el envio?')} className="btn btn-primary fontSizeQuestions">Tiene costo el envio?</a>
                </div>
                <div style={{ margin: '2px' }} className="col-12 col-sm-4 col-md-3 col-lg-2">
                    <a onClick={() => preguntar_sobre('Tiene garantía?')} className="btn btn-primary fontSizeQuestions">Tiene garantía?</a>
                </div>
                <div style={{ margin: '2px' }} className="col-12 col-sm-6 col-md-3 col-lg-3">
                    <a onClick={() => preguntar_sobre('Puedo recoger el producto?')} className="btn btn-primary fontSizeQuestions">Puedo recoger el producto?</a>
                </div>
                <div onClick={goWhats} style={{ margin: '2px' }} className="col-12 col-sm-6 col-md-2 col-lg-2">
                    <a ><img className='centerImgCarousel' src={params.globalVars.urlRoot + 'Images/Config/whatsApp_btn.png'} /></a>
                </div>
                <br /><br /><br />
            </div>
            <div className="row" >
                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                    <textarea onChange={functionSetMensaje} id='tv_preguntar' style={{ backgroundColor: '#D5DBDB', padding: '0.2em' }} className="form-control-plaintext rounded" rows="2" cols="150" placeholder="Escribe una pregunta..." value={mensaje}></textarea>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                    <button id='btnPreguntar' type="button" onClick={check_pregunta} style={{ margin: '2px' }} className="btn btn-outline-success btn-lg fontSizeQuestions" >Preguntar</button>
                    <button id='botonLoading' style={{ display: 'none', color: 'black' }} className="btn btn-outline-success" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
            </div>
            <br />
            <div id="div_contenedor_preguntas" className="container border">
                <h4 style={{ marginBottom: '0.4em' }}>{preguntas.length == 0 ? '' : 'Preguntas realizadas:'}</h4>
                {preguntas.map((item, index) => {
                    return (
                        <div className='container' key={index}>
                            <h5 style={{ marginTop: '0.2em' }}><li>{item.pregunta}</li></h5>
                            <p style={{ color: 'gray' }}>{item.respuesta == null ? 'En breve uno de nuestros asesores dará respuesta...' : item.respuesta}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Questions