import React, { useContext } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Buscar from '../ui/Buscar';
import Navegacion from './Navegacion';
import Boton from '../ui/Boton';
import { FirebaseContext } from '../../firebase';

const ContenedorHeader = styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;
    @media (min-width:768px) {
        display: flex;
        justify-content: space-between;
    }
`;

const Logo = styled.a`
    color: var(--naranja);
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: 'Roboto Slab', serif;
    margin-right: 2rem;
    &:hover {
        cursor: pointer;
    }
`;

const Headers = styled.header`
    border-bottom: 2px solid var(--gris3);
    padding: 1rem 0;
`;
const ContenedorHeaderDiv = styled.div`
    display:flex;
    align-items: center;
`;

const UsuarioP = styled.p`
    margin-right: 2rem;
`;


const Header = () => {
    const { usuario, firebase } = useContext(FirebaseContext);
    return ( 
        <Headers>
            <ContenedorHeader>
                <ContenedorHeaderDiv>
                    <Link href="/">
                        <Logo>P</Logo>
                    </Link>
                    

                    <Buscar />

                    <Navegacion />
                </ContenedorHeaderDiv>

                <ContenedorHeaderDiv>
                    { usuario ? (
                        <>
                            <UsuarioP>Hola: {usuario.displayName}</UsuarioP>
                            <Boton
                                bgColor="true"
                                onClick={() => firebase.cerrarSesion()}
                            >Cerrar Sesión</Boton>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Boton
                                    bgColor="true"
                                >Login</Boton>
                            </Link>
                            <Link href="/crear-cuenta">
                                <Boton>Crear Cuenta</Boton>
                            </Link>
                        </>
                    ) }
                </ContenedorHeaderDiv>
            </ContenedorHeader>
        </Headers>
     );
}
 
export default Header;