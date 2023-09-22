import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link } from '@inertiajs/react';
import MuiAutoComplete from '@/Pages/UIGeneral/MuiAutoComplete'
import React, { useState, useEffect } from 'react'
import NavLinkCarrito from '@/Components/NavLinkCarrito'
import Swal from 'sweetalert2'

export default function Authenticated({ user, header, children, info, globalVars, productos, categorias }) {

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)
    const [colorBadgeCarrito, setColorBadgeCarrito] = useState('black')
    const [numCarrito, setNumCarrito] = useState(0)

    useEffect(() => {
        getSize()
        if (user) {
            fetchCarrito()
        }
    }, [])

    function fetchCarrito() {
        const url = globalVars.thisUrl + 'shopping/' + user.email
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                if (json.length > 0) {
                    setNumCarrito(json.length)
                    setColorBadgeCarrito('green')
                }
            })
    }

    function goHome() {
        document.getElementById('linkHome').click()
    }

    window.onresize = getSize

    function getSize() {
        const ancho = window.innerWidth;
        if (ancho > 768 & document.getElementById('search1') != null) {
            document.getElementById('search1').style.display = 'inline'
            document.getElementById('search2').style.display = 'none'
        } else {
            document.getElementById('search1').style.display = 'none'
            document.getElementById('search2').style.display = 'inline'
        }
    }

    function validarLogin() {
        if (user) {
            window.location.href = globalVars.thisUrl + "shopping/" + user.email + "/edit"
        } else {
            Swal.fire({
                title: 'Debes identificarte para ver tu carrito!',
                icon: 'warning',
                showCancelButton: false,
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            })
            setTimeout(() => {
                window.location.href = globalVars.thisUrl + 'log'
            }, 1500);
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <nav style={{ backgroundColor: info.color_pagina }} >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link id='linkHome' href={route('index')}>
                                    <img className='img-fuild rounded' width="60em" height="60em" src={info.logo == '' ? globalVars.urlRoot + 'Images/Config/noPreview.jpg' : globalVars.urlRoot + "Images/Products/" + info.logo} />
                                </Link>
                            </div>
                            <div className="hidden space-x-8 md:-my-px md:ml-10 md:flex ">

                            </div>
                        </div>
                        <div className="hidden md:flex md:items-center md:ml-6">
                            <div className="hidden md:flex md:items-center md:ml-6">
                                <div style={{ marginTop: '0.1em' }} className="ml-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button type="button"
                                                    className="inline-flex items-center px-3 py-2 text-md leading-4 font-medium rounded-md text-black hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" >
                                                    Categorias
                                                    <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            {categorias.map((item) => {
                                                return (
                                                    <Dropdown.Link key={item.id} href={route('product.search', item.nombre)}>{item.nombre}</Dropdown.Link>
                                                )
                                            })}

                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                            <NavLink href={route('contact')} active={route().current('contact')}>
                                Contáctanos
                            </NavLink>
                            <NavLinkCarrito style={{ marginLeft: '-0.2em' }} onClick={validarLogin} active={route().current('shopping')}>
                                <span style={{ color: 'white', backgroundColor: colorBadgeCarrito }} className="text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                                    <svg style={{ marginRight: '0.1em', color: 'white' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
                                        <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                                    </svg>
                                    {numCarrito}
                                </span>
                            </NavLinkCarrito>
                            <div id='search1' style={{ marginTop: '0.6em' }}>
                                <MuiAutoComplete className='form-control mr-sm-2' productos={productos} url={globalVars.thisUrl}></MuiAutoComplete>
                            </div>
                            <div style={{ marginTop: '0.6em' }} className="ml-3 relative">
                                {user ?
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" >
                                                    {user.name.split(' ')[0]}
                                                    <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit', user.email)}>Cuenta</Dropdown.Link>
                                            <Dropdown.Link href={route('shopping.create')}>Mis compras</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Salir
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                    :
                                    <a href={route('gologin')} className="inline-flex rounded-md">
                                        <button type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" >
                                            Ingresar
                                        </button>
                                    </a>
                                }
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center md:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 bg-white hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ marginLeft: '0.5em' }} className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button type="button"
                                        className="inline-flex items-center px-3 py-2 text-md leading-4 font-medium rounded-md text-black hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" >
                                        Categorias
                                        <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                {categorias.map((item) => {
                                    return (
                                        <Dropdown.Link key={item.id} href={route('product.search', item.nombre)}>{item.nombre}</Dropdown.Link>
                                    )
                                })}

                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <NavLink href={route('contact')} active={route().current('contact')}>
                            Contáctanos
                        </NavLink>
                    </div>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLinkCarrito style={{ marginLeft: '-0.2em' }} onClick={validarLogin} active={route().current('shopping')}>
                            <span style={{ color: 'white', backgroundColor: colorBadgeCarrito }} className="text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                                <svg style={{ marginRight: '0.1em', color: 'white' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart4" viewBox="0 0 16 16">
                                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                                </svg>
                                {numCarrito}
                            </span>
                        </NavLinkCarrito>
                    </div>

                    <div style={{ marginLeft: '0.2em' }} className="pt-4 pb-1 border-t border-gray-200">
                        {user ?
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" >
                                            {user.name.split(' ')[0]}
                                            <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit', user.email)}>Cuenta</Dropdown.Link>
                                    <Dropdown.Link href={route('shopping.create')}>Mis compras</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Salir
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                            :
                            <a href={route('gologin')} className="inline-flex rounded-md">
                                <button type="button"
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" >
                                    Ingresar
                                </button>
                            </a>
                        }
                    </div>
                    <div style={{ marginLeft: '0.2em'}} id='search2' >
                        <MuiAutoComplete className='form-control mr-sm-2' productos={productos} url={globalVars.thisUrl}></MuiAutoComplete>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>

        </div>
    );
}

