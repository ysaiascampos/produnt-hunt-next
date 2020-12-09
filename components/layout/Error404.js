import React from 'react';
import styled from '@emotion/styled';
const TextError = styled.h1`
    margin-top: 5rem;
    text-align: center;
`;

const Error404 = () => {
    return ( <TextError>Producto no existente</TextError> );
}
 
export default Error404;