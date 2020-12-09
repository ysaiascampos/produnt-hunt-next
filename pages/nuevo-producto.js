import React, { useState, useContext } from 'react';
import {css} from '@emotion/core';
import Router, { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import styled from '@emotion/styled';
import Layout from '../components/layout/Layout';
import Error404 from '../components/layout/Error404';
import { Formulario, Campo, InputSubmit,Error } from '../components/ui/Formulario';


import {FirebaseContext} from '../firebase';

//validacion
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';
const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    imagen: '',
    url: '',
    descripcion: ''
}

const NuevoProductoH1 = styled.div`
text-align: center;
margin-top: 5rem;
`;

export default function NuevoProducto() {
    //state de las imagenes
    const [nombreimagen, guardarNombre] = useState('');
    const [subiendo, guardarSubiendo] = useState(false);
    const [ progreso, guardarProgreso ] = useState(0);
    const [urlimagen, guardarUrlImagen] = useState('');


    const [error, setError] = useState(false);

    const {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur
    } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

    const { nombre, empresa, imagen, url, descripcion } = valores;

    //hook de routing para redireccionar
    const router = useRouter();
    // Context con las operaciones crud de firebase
    const { usuario, firebase } = useContext(FirebaseContext);

    async function crearProducto(){
        // si el usuario no esta autenticado llavar al login
        if(!usuario){
            return router.push('/login');
        }

        //crear el objeto de nuevo producto
        const producto = {
            nombre, 
            empresa, 
            url, 
            urlimagen,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: {
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado: []
        }

        // insertarlo en la base de datos
        
        await firebase.db.collection('productos').add(producto);
        return router.push('/');
    }


    const handleUploadStart = () => {
        guardarProgreso(0);
        guardarSubiendo(true);
    }

    const handleProgress = async (progreso, task) => {
        guardarProgreso(progreso);
        if(progreso === 100){
            handleUploadSuccess(task.snapshot.ref.name);
        }
    }

    const handleUploadError = error => {
        guardarSubiendo(error);
        console.error(error);
    }

    const handleUploadSuccess = async nombre => {
        guardarSubiendo(false);
        guardarNombre(nombre);
        await firebase.
            storage
            .ref("productos")
            .child(nombre)
            .getDownloadURL()
            .then((url) => {
                console.log(url);
                guardarUrlImagen(url);
            });
        
    };
    return (
        <div>
            <Layout>
            { !usuario ? <Error404 />: (
                <>
                <NuevoProductoH1><h1>Nuevo Producto</h1></NuevoProductoH1>
                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <fieldset>
                        <legend>Información General</legend>
                        <Campo>
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                placeholder="Nombre del Producto"
                                name="nombre"
                                value={nombre}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.nombre && <Error>{errores.nombre}</Error>}

                        <Campo>
                            <label htmlFor="empresa">Empresa</label>
                            <input
                                type="text"
                                id="empresa"
                                placeholder="Nombre Empresa o Compañia"
                                name="empresa"
                                value={empresa}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.empresa && <Error>{errores.empresa}</Error>}

                        <Campo>
                            <label htmlFor="image">Imagen</label>
                            <FileUploader 
                                id="imagen"
                                accept="imagen/*"
                                name="imagen"
                                storageRef={firebase.storage.ref("productos")}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                //onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                                randomizeFilename
                            />
                            
                        </Campo>
                        <Campo>
                            <label htmlFor="url">URL</label>
                            <input
                                type="url"
                                id="url"
                                placeholder="URL de tu producto"
                                name="url"
                                value={url}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.url && <Error>{errores.url}</Error>}
                    </fieldset>
                    <fieldset>
                        <legend>Sobre tu Producto</legend>
                        <Campo>
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={descripcion}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {errores.descripcion && <Error>{errores.descripcion}</Error>}
                    </fieldset>
                    {error && <Error>{error}</Error>}
                    <InputSubmit 
                        type="submit"
                        value="Crear Producto"
                    />
                </Formulario>
            </>
            )}
            </Layout>
        </div>
    )
}
