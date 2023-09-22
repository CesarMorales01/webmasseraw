import React from 'react'
import CopyRight from '../UIGeneral/CopyRight';
import '../../../css/general.css'
import WhastsappButton from '@/Components/WhatsappButton';

const Contact = (params) => {

  function goFb() {
    window.open(params.datos.linkfb, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
  }

  function goWhats() {
    let href = "https://api.whatsapp.com/send?phone=57" + params.datos.telefonos[0].telefono + "&text=Hola! He visitado tu página y me gustaria preguntar algo!";
    window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
  }

  function goInsta() {
    window.open(params.datos.linkinsta, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
  }

  return (
    <footer style={{ margin: '0.3em' }} className="page-footer font-small sombraBlanco">
      <div className="container">
        <br />
        <h5 style={{ fontSize: '1.4em', padding: '0.5em' }} className='textAlignCenter superTitulo'> ¿Quiénes somos?</h5>
        <div className="container">
          <div style={{ marginTop: '1em' }} >
            <div >
              <h1 style={{ marginTop: 6, fontSize: '1em' }} className="card-title">
                {params.datos.descripcion_pagina}
              </h1>
            </div>
          </div>
        </div>
        <div className="row d-flex text-center justify-content-center mb-md-0 mb-4">
          <div className="col-md-8 col-12 mt-3">
            <div className="row">
              <div className="col-md-6">
                <img className='centerImgCarousel rounded' width="200px;" src={params.url + 'Images/Products/' + params.datos.imagen} alt='' />
              </div>
              <div className="col-md-6">
              <h5 style={{ fontSize: '1.4em', marginTop: window.screen.width < 600 ? '1em' : '' }} className='textAlignCenter'>Dirección</h5>
                <p style={{ margin: '2px' }} >
                  {params.datos.direccion_pagina}
                </p>
                <br />
                <h5 style={{ fontSize: '1.4em' }} className='textAlignCenter'>Télefonos</h5>
                {params.datos.telefonos.map((item, index) => {
                  return (
                    <span style={{ margin: '2px' }} key={index}>
                      <li>{item.telefono}</li>
                    </span>
                  )
                })}
                <p >E-mail: {params.datos.correo}</p>
                <br /><br />
                <div onClick={goWhats} className="container">
                  <WhastsappButton style={{ cursor: 'pointer' }} type="button">
                    <img alt='' height='30em' width='30em' src={params.url + 'Images/Config/whatsApp_btn.png'} />
                    <a style={{ marginLeft: '0.4em' }}>!Escribénos!</a>
                  </WhastsappButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="row pb-3">
          <div className="col-md-12 textAlignCenter">
            <div className="mb-5 flex-center">
              {/*Facebook*/}
              <a onClick={goFb} style={{ marginRight: '2px' }} className="fb-ic cursorPointer">
                <i style={{ color: 'blue' }} className="fab fa-facebook-f fa-lg white-text mr-4"> </i>
              </a>
              {/*Instagram*/}
              <a onClick={goInsta} style={{ marginLeft: '2px', color: 'pink' }} className="ins-ic cursorPointer">
                <i style={{ marginRight: '0.4em', color: '#c82590' }} className="fa-brands fa-instagram fa-lg"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <CopyRight url={params.url} version='' />

    </footer>
  )
}

export default Contact