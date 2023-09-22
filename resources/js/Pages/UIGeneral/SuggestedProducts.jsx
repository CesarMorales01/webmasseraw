import React from 'react'

const SuggestedProducts = (params) => {

    function removeLoad(e){
       document.getElementById('load'+e).style.display='none'
    }

    function goProduct(e){
        window.location.href= params.globalVars.thisUrl+'product/'+e
    }

    return (
        <div className="container">
            <div style={{ margin: '0.2em' }} className="container tituloCategorias rounded">
                <h5 style={{ fontSize: '1.4em', padding: '0.5em' }} className='textAlignCenter'>{params.categoria}</h5>
            </div>
            <div className="container">
                <div className="row">
                    {params.productos.map((item, index) => {
                        return (
                            <div style={{ marginTop: '0.5em' }} key={index} id={item.codigo} onClick={()=>goProduct(item.codigo)} className="col-md-4 col-sm-6 col-6 card-flyer rounded">
                                <div className="cursorPointer">
                                    <span style={{ marginLeft: '1em' }} id={'load'+item.codigo} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <img style={{ padding: '0.5em', marginTop: '0.2em' }} onLoad={()=>removeLoad(item.codigo)} src={params.globalVars.urlRoot + '/Images/Products/' + item.imagen} className="card-img-top rounded img-thumbnail" />
                                    <h5 className='textAlignCenter generalFontStyle' >{item.nombre}</h5>
                                    <h5 style={{ margin: '0.5em', color: item.precio == '$ 0' ? 'gray' : 'black' }} className="generalFontStyle">
                                        {item.cantidad == '0' ? 'Agotado' : item.precio}
                                    </h5>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SuggestedProducts