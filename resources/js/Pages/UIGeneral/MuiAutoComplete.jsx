import { Autocomplete, TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'

function MuiAutoComplete(params) {

    const [value, setValue] = React.useState('')
    const [inputValue, setInputValue] = React.useState('')

    useEffect(() => {
        getSize()
    }, [])

    window.onresize = getSize

    function getSize() {
        let ancho = window.innerWidth;
        if (ancho < 1090 && ancho > 700 & document.getElementById('btnSearch') != null) {
            document.getElementById('btnSearch').style.display = 'none'
        } else {
            document.getElementById('btnSearch').style.display = 'inline'
        }
    }

    let datos = []
    for (let i = 0; i < params.productos.length; i++) {
        let opt = new OptionsAuto(params.productos[i].id, params.productos[i].nombre)
        datos.push(opt)
    }

    function getInputChange(newInputValue) {
        // se ejecuta siempre que hay cambio en el input
        setInputValue(newInputValue)
    }

    function getOnchange(newValue) {
        // Se ejecuta al cambiar un valor del array
        const tipo = typeof newValue
        if (tipo === 'object') {
            const busc = datos.filter(val => val === newValue)
            window.location.href = params.url + 'product/' + busc[0].id
        } else {
            window.location.href = params.url + 'product/search/' + newValue
        }
    }

    function buscar() {
        window.location.href = params.url + 'product/search/' + inputValue
    }

    function submitHandler(e) {
        e.preventDefault();
    }

    return (
        <div className="input-group">
            <Autocomplete style={{ backgroundColor: 'white' }}
                disablePortal
                id="combo-box-demo"
                value={value}
                sx={{ width: 260 }}
                renderInput={(params) => <TextField {...params} InputLabelProps={{ style: { color: 'black' } }} label="Buscar..." size="small" />}
                onChange={(_, newValue) => {
                    getOnchange(newValue)
                }}
                inputValue={inputValue}
                onInputChange={(_, newInputValue) => {
                    getInputChange(newInputValue)
                }}
                options={datos}
                freeSolo
            />
            <button id='btnSearch' type='button' className='btn btn-success' style={{ backgroundColor: 'green' }} onClick={buscar}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
            </button>
        </div>
    )
}

export default MuiAutoComplete;

class OptionsAuto {
    constructor(id, label) {
        this.id = id;
        this.label = label;
    }

    getLabel() {
        return this.label
    }

    getId() {
        return this.id
    }

}