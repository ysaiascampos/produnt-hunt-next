import React, { useState, useEffect } from 'react';
const useValidacion = (initialState, validar, fn) => {

    const [valores, setValores] = useState(initialState);
    const [errores, setErrores] = useState({});
    const [submitForm, setSubmitForm] = useState(false);
    useEffect(() => {
        if(submitForm) {
            const noErrores = Object.keys(errores).length === 0;
            if(noErrores){
                fn(); //fn = funcion que se ejecuta en el componente
            }
            setSubmitForm(false);
        }
    }, [errores]);

    //funcion que se ejecuta conforme el usuario escribe algo
    const handleChange = e => {
        setValores({
            ...valores,
            [e.target.name] : e.target.value
        })
    }

    //funcion que se ejecuta conforme el usuario hace submit
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
        setSubmitForm(true);
    }

    //funcion que se ejecuta conforme el usuario hace evento de blur
    const handleBlur = e => {
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
    }


    return {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur
    }
}
 
export default useValidacion;