export default function validarCrearProducto(valores) {
    let errores = {};

    //validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre = "El Nombre es obligatorio";
    }

    //validar el nombre de empresa
    if(!valores.empresa){
        errores.empresa = "El Nombre de Empresa es obligatorio";
    }

    //validar el url
    if(!valores.url){
        errores.url = "La url es obligatorio";
    } else if( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = "La url mal formateada o no válida";
    }

    //validar el descripcion
    if(!valores.descripcion){
        errores.descripcion = "Agrega una descripción de tu producto";
    }
    
    return errores;
}