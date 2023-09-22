class PojoProducto{
    listaImagenes=[];
    nombre;
    codigo;
    descripcion;
    categoria;
    imagen;
    precio;
    referencia;
    cantidad;

    constructor(nombre, codigo) {
      this.nombre = nombre;
      this.codigo = codigo;
  }

    setRef(ref){
        this.referencia=ref;
    }


    setDescripcion(desc){
        this.descripcion=desc;
    }

    setPrecio(precio){
        this.precio=precio;
    }

    setCate(cat){
        this.categoria=cat;
    }

    setImagen(img){
        this.imagen=img;
    }

    setListaImagenes(lista){
        this.listaImagenes=lista
    }

    setCantidad(cant){
        this.cantidad=cant
    }


}

export default PojoProducto;