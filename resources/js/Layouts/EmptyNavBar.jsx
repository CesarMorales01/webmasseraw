import { Link } from '@inertiajs/react';

export default function EmptyNavBar(params) {

    function goHome() {
        document.getElementById('linkHome').click()
    }

    return (
        <div className="min-h-screen bg-white">
            <nav style={{ backgroundColor: params.info.color_pagina }} >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link id='linkHome' href={route('index')}>
                                    <img className='img-fuild rounded' width="60em" height="60em" src={params.info.logo == '' ? params.globalVars.urlRoot + '/Images/Config/noPreview.jpg' : params.globalVars.urlRoot + "Images/Products/" + params.info.logo} />
                                </Link>
                                <span onClick={goHome} style={{ color: 'white', cursor: 'pointer', marginLeft: '0.2em' }}>{params.info.nombre}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main>{params.children}</main>
        </div>
    );
}