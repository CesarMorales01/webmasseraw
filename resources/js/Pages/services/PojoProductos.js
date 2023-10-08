class PojoProducto{
    listaImagenes=[];
    nombre;
    codigo;
    descripcion;
    categoria;
    imagen;
    valor;
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

    setValor(precio){
        this.valor=precio;
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