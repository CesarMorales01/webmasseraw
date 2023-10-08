import React from 'react'
import { useState, useEffect } from 'react';
import SuggestedProducts from '../UIGeneral/SuggestedProducts';
import '../../../css/general.css'
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Contact from '../Contact/Contact';
import PojoProducto from '../services/PojoProductos'

const Searched = (params) => {
    const [products, setProducts] = useState(params.productos)

    useEffect(() => {
        if (params.productos == 0) {
            functionSetProductosSugeridos()
        }
    }, [])

    function numeroAleatorio() {
        return parseInt(Math.random() * (params.allproducts.length - 0) + 0)
    }

    function functionSetProductosSugeridos() {
        if (products.length == 0) {
            // Creación de arrays para mostrar resumen de productos por categorias
            let array = []
            let num1 = numeroAleatorio()
            let num2 = num1 + 12
            if (num2 > params.allproducts.length) {
                num1 = 0
                num2=params.allproducts.length
            }
            for (let x = num1; x < num2; x++) {
                let pojo = new PojoProducto(params.allproducts[x].nombre, params.allproducts[x].id)
                pojo.setImagen(params.allproducts[x].imagen.nombre_imagen)
                // darle formato al precio
                pojo.setValor(params.allproducts[x].valor)
                pojo.setRef(params.allproducts[x].referencia)
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
            setProducts(array2)
        }
    }

    return (
        <>
            <Head title='Búsqueda' />
            <AuthenticatedLayout user={params.auth} info={params.info} globalVars={params.globalVars} productos={params.allproducts} categorias={params.categorias}>
                <div className='container textAlignCenter'>
                    <SuggestedProducts categoria={params.productos.length == 0 ? 'No se han encontrado resultados para ' + params.producto + '. Que tal estas sugerencias!' : 'Resultados encontrados para ' + params.producto} productos={products} globalVars={params.globalVars} />
                </div>
                <Contact url={params.globalVars.urlRoot} datos={params.info}></Contact>
            </AuthenticatedLayout >
        </>
    )
}

export default Searched