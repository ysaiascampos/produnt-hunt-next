import React, { useState } from 'react';
import {css} from '@emotion/core';
import Router from 'next/router';
import styled from '@emotion/styled';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit,Error } from '../components/ui/Formulario';

import firebase from '../firebase';

//validacion
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

const CrearCuentaH1 = styled.div`
    text-align: center;
    margin-top: 5rem;
`;

export default function Login() {
  const [error, setError] = useState(false);

  const STATE_INICIAL = {
      email: '',
      password: ''
  }
  const {
      valores,
      errores,
      handleChange,
      handleSubmit,
      handleBlur
  } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = valores;

  async function iniciarSesion(){
      try {
          await firebase.login(email, password);
          Router.push('/');
      } catch (error) {
          console.error('Hubo un error al autenticar el usuario', error.message);
          setError(error.message);
      }
  }
  
return (
  <div>
    <Layout>
      <>
          <CrearCuentaH1><h1>Iniciar Sesión</h1></CrearCuentaH1>
          <Formulario
              onSubmit={handleSubmit}
              noValidate
          >
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
                  value="Iniciar Sesión"
              />
          </Formulario>
      </>
    </Layout>
  </div>
)
}