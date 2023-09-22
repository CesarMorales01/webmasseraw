import React from 'react'
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Contact from './Contact';

const ContactLayout = (params) => {
  return (
    <>
      <Head title="Contacto" />
      <AuthenticatedLayout user={params.auth} info={params.info} globalVars={params.globalVars} productos={params.productos} categorias={params.categorias}>
        <Contact url={params.globalVars.urlRoot} datos={params.info}></Contact>
      </AuthenticatedLayout >
    </>
  )
}

export default ContactLayout