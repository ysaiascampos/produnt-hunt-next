import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { FirebaseContext } from '../../firebase';
import Layout from '../../components/layout/Layout';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';
import Error404 from '../../components/layout/Error404';
import styled from '@emotion/styled';
import { set } from 'date-fns';
const TextTitulo = styled.h1`
    margin-top: 5rem;
    text-align: center;
`;
const TituloComentario = styled.h2`
    margin: 2rem 0;
`;
const ListaComentario = styled.div`
    ul{

    }
    li{
        border: 1px solid #e1e1e1;
        padding: 2rem; 
    }
    span{
        font-weight:bold;
    }
`;

const ContenedorProducto = styled.div`
    @media (min-width: 768px){
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;
const TextVotos = styled.div`
    margin-top: 5rem;
    p{
        text-align: center;
    }    
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;


const Producto = () => {
    //state del componente
    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({});
    const [consultarBD, setConsultarBD] = useState(true)

    // Router para obtener id
    const router = useRouter();
    const { query: { id }} = router;

    // context de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if(id && consultarBD) {
            const obtenerProducto = async () => {
                
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if(producto.exists){
                    setProducto(producto.data());
                    setError(false);
                } else {
                    setError(true);
                }
                setConsultarBD(false);
                
            }
            obtenerProducto();
        }
    }, [id]);

    if(Object.keys(producto).length === 0 && !error ) return 'Cargando...';

    const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto;

    //Administrar y validar los votos
    const votarProducto = async () => {
        if(!usuario) {
            return router.push('/login');
        }
        //Verificar si el usurio actual ah votado
        if(haVotado.includes(usuario.uid)){
            return;
        }
        const hasVotado = [
            ...haVotado,
            usuario.uid
        ];
        // obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        //Actualizar en la bd
        await firebase.db.collection('productos').doc(id).update({ 
            votos: nuevoTotal, 
            haVotado: hasVotado 
        });

        //Actualizar el state
        setProducto({
            ...producto,
            votos: nuevoTotal
        })
        setConsultarBD(true); 
    }

    //funciones para crear comentario
    const comentarioChange = e => {
        setComentario({
            ...comentario,
            [e.target.name] : e.target.value
        })
    }
    const agregarComentario = async e => {
        e.preventDefault();
        if(!usuario) {
            return router.push('/login');
        }

        //informacion extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;
        //Tomar copia de comentarios y agregarlos al arreglo
        const nuevosComentarios = [...comentarios, comentario];
        //Actualizar en la bd
        await firebase.db.collection('productos').doc(id).update({ 
            comentarios: nuevosComentarios
        });
        //Actualizar el state
        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        });
        setConsultarBD(true); // hay un COMENTARIO, por lo tanto consultar a la BD
    }

    // Identifica si el comentario es del creador del producto
    const esCreador = id => {
        if(creador.id == id) {
            return true;
        }
    }

    // función que revisa que el creador del producto sea el mismo que esta autenticado
    const puedeBorrar = () => {
        if(!usuario) return false;

        if(creador.id === usuario.uid) {
            return true
        }else{
            return false;
        }
    }

    // elimina un producto de la bd
    const eliminarProducto = async () => {

        if(!usuario) {
            return router.push('/login')
        }

        if(creador.id !== usuario.uid) {
            return router.push('/')
        }

        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/')
        } catch (error) {
            console.log(error);
        }
    }

    return ( 
        <Layout>
            <>
            { error ? <Error404 />: (
                <div className="contenedor">
                    <TextTitulo>{nombre}</TextTitulo>
                    <ContenedorProducto>
                        <div>
                            <p>Publicado hace: { formatDistanceToNow( new Date(creado), {locale: es} )}</p>
                            { creador && <p>por: {creador.nombre} de: {empresa}</p>}
                            <img src={urlimagen} />
                            <p>{descripcion}</p>

                            { usuario && (
                                <>
                                <h2>Agrega tu comentario</h2>
                                <form
                                    onSubmit={agregarComentario}
                                >
                                    <Campo>
                                        <input
                                            type="text"
                                            name="mensaje" 
                                            onChange={comentarioChange}
                                        />
                                    </Campo>
                                    <InputSubmit
                                        type="submit"
                                        value="Agregar Comentario"
                                    />
                                </form>
                                </>
                            )}
                            <ListaComentario>
                                <TituloComentario>Comentarios</TituloComentario>
                                {comentarios.length === 0 ? "Aún no hay comentarios" : (
                                <ul>
                                    {comentarios.map((comentario, i) => (
                                        <li key={`${comentario.usuarioId}-${i}`}>
                                            <p>{comentario.mensaje}</p>
                                                    <p>Escrito por: 
                                                        <span>
                                                        {''} {comentario.usuarioNombre}
                                                        </span>
                                                    </p>
                                                    { esCreador( comentario.usuarioId ) && <CreadorProducto>Es Creador</CreadorProducto> }
                                        </li>
                                    ))}
                                </ul>
                                )}
                            </ListaComentario>
                        </div>
                        <aside>
                            <Boton
                                target="_blank"
                                bgColor="true"
                                href={url}
                            >Visitar Url</Boton>
                            
                            <TextVotos>
                                <p>{votos} Votos</p>
                                { usuario && (
                                    <Boton
                                        onClick={votarProducto}
                                    >Votar</Boton>
                                )}
                            </TextVotos>                        
                        </aside>
                    </ContenedorProducto>
                    {
                        puedeBorrar() && 
                        <Boton
                            onClick={eliminarProducto}
                        >Eliminar Producto</Boton>
                    }
                </div>
            ) }
            </>
        </Layout> 
    );
}
 
export default Producto;
