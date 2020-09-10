import React, {useState, useEffect, Fragment} from 'react';

// servicios
import {AxiosGET} from "../../services/Axios";

// componentes
import Loading from "../../components/Loading";

const History = props => {

    const [loading, setloading] = useState(false);
    const [clients, setclients] = useState([]);

    useEffect(() => {
        setloading(true);
        AxiosGET('clients', callbackLoadClients);
    }, []);

    // cargar clientes
    const callbackLoadClients = (status, response) => {
        if (status === 200) setclients(response.clients);

        if (status === 1000) setloading(false);
    };

    return (
        <Fragment>

            {
                loading && <Loading/>
            }
            <div className="row">
                {
                    clients.map(x => (
                        <div className="col-12 item-vehicle-to-client">
                            <b>Nombre: {x.name}</b><br/>
                            <b>Número de identificación: {x.number}</b>
                            <br/>
                            <b>Vehiculos:</b>
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Place/Serial</th>
                                    <th>Tipo</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    x.vehicles.length > 0 ? x.vehicles.map(v => (
                                        <tr key={v.id}>
                                            <td>{v.id}</td>
                                            <td>{v.code}</td>
                                            <td>{v.type}</td>
                                            <td></td>
                                        </tr>
                                    )) : <tr><td colSpan="4">No tiene vehiculos</td></tr>
                                }
                                </tbody>
                            </table>
                        </div>
                    ))
                }
            </div>

        </Fragment>
    );
};

export default History;
