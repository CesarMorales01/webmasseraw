import React from 'react'
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import '../../../css/general.css'

const ValidarPago = (params) => {

    useEffect(() => {
        fetchValidarPago()
    }, [])

    function fetchValidarPago() {
        const url = 'https://production.wompi.co/v1/transactions/'+params.id
      // const url = 'https://sandbox.wompi.co/v1/transactions/'+params.id
        fetch(url).then((response) => {
            return response.json()
        }).then((json) => {
            if(json.data.status=='APPROVED'){
                window.location=params.globalVars.thisUrl+'shopping/create'
            }else{
                window.location=params.globalVars.thisUrl+'/shopping/'+params.auth.email+'/edit'
            }
        })
    }

    return (
        <div style={{ textAlign: 'center', padding: '5em' }} className='container'>
            <h1>Comprobando pago...</h1>
            <img className='centerImgCarousel' style={{ width: '15%', height: 'auto' }} alt='' src={params.globalVars.urlRoot + 'Images/Config/loading.gif'}></img>
        </div>
    )
}

export default ValidarPago