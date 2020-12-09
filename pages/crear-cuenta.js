import React, { useState } from 'react';
import {css} from '@emotion/core';
import Router from 'next/router';
import styled from '@emotion/styled';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit,Error } from '../components/ui/Formulario';

import firebase from '../firebase';

//validacion
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';
const STATE_INICIAL = {
    nombre: '',
    email: '',
    password: ''
}

const CrearCuentaH1 = styled.div`
    text-align: center;
    margin-top: 5rem;
`;

export default function CrearCuenta() {
    const [error, setError] = useState(false);

    
    const {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur
    } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

    const { nombre, email, password } = valores;

    async function crearCuenta(){
        try {
            await firebase.registrar(nombre, email, password);
            Router.push('/');
        } catch (error) {
            console.error('Hubo un error al crear el usuario', error.message);
            setError(error.message);
        }
    }
    
  return (
    <div>
      <Layout>
        <>
            <CrearCuentaH1><h1>Crear Cuenta</h1></CrearCuentaH1>
            <Formulario
                onSubmit={handleSubmit}
                noValidate
            >
                
                <Campo>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        placeholder="Tu Nombre"
                        name="nombre"
                        value={nombre}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>
                {errores.nombre && <Error>{errores.nombre}</Error>}
                <Campo>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Tu Email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>
                {errores.email && <Error>{errores.email}</Error>}
                <Campo>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Tu Password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>
                {errores.password && <Error>{errores.password}</Error>}
                {error && <Error>{error}</Error>}
                <InputSubmit 
                    type="submit"
                    value="Crear Cuenta"
                />
            </Formulario>
        </>
      </Layout>
    </div>
  )
}
