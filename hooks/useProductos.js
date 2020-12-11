import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../firebase';


const useProductos = orden => {
    const [productos, setProductos] = useState([]);

    const { firebase } = useContext(FirebaseContext);
    useEffect(() => {
        const obtenerProductos = async () => {
        await firebase.db.collection('productos').orderBy(orden, 'desc').onSnapshot(manejarSnapshot);
        }
        obtenerProductos();
    }, []);

    function manejarSnapshot(snapshot) {
        const producto = snapshot.docs.map(doc => {
        return {
            id: doc.id,
            ...doc.data()
        }
        });

        setProductos(producto);
    }
    return {
        productos
    }
}
 
export default useProductos;
