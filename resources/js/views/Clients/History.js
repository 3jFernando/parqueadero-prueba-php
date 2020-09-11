import React, {useState, useEffect, Fragment} from 'react';

// servicios
import {AxiosGET, AxiosPOST} from "../../services/Axios";

// componentes
import Loading from "../../components/Loading";
import NewVehicle from "./Vehicles/New";

const History = props => {

    const [loading, setloading] = useState(false);
    const [clients, setclients] = useState([]);
    const [modalNewVehicule, setModalNewVehicule] = useState('hide');
    const [typeVechicles, setTypeVechicles] = useState([]);
    const [clientActived, setclientActived] = useState(null);

    useEffect(() => {
        setloading(true);
        loadClients();
        AxiosGET('settings/vehicles', callbackLoadTypeVehicles);
    }, []);

    // cargar clientes
    const loadClients = () => {
        AxiosGET('clients', callbackLoadClients);
    };
    const callbackLoadClients = (status, response) => {
        if (status === 200) setclients(response.clients);

        if (status === 1000) setloading(false);
    };
    // cargar tipos de vahiculos
    const callbackLoadTypeVehicles = (status, response) => {
        if (status === 200) setTypeVechicles(response.types);

        if (status === 1000) setloading(false);
    };

    // eliminar vehiculos de un cliente
    const deleteVehicleClient = vehicle => {
        const cDelete = confirm(`¿seguro que deseas elimar el Vehiculo con placas/serial ${vehicle.code}?`);
        if(!cDelete) return false;

        setloading(true);
        AxiosPOST('clients/vehicles/destroy', {id: vehicle.id}, callbackDeleteVehicleClient);
    };
    const callbackDeleteVehicleClient = (status, response) => {
        if (status === 200) {
            if(response.status === 200) {
                loadClients();
            } else if(response.status === 460) {
                alert("El Vehiculo esta presentando problemas");
            } else if(response.status === 200) {
                alert("El Vehiculo ya ha sido usado para funciones del sistema.\n\nNo es posible eliminar.");
            }
        }

        if (status === 1000) setloading(false);
    };

    // eliminar  un cliente
    const deleteClient = _cli => {
        const cDelete = confirm(`¿seguro que deseas elimar Cliente ${_cli.name}?`);
        if(!cDelete) return false;

        setloading(true);
        AxiosPOST('clients/destroy', {id: _cli.id}, callbackDeleteClient);
    };
    const callbackDeleteClient = (status, response) => {
        if (status === 200) {
            if(response.status === 200) {
                loadClients();
            } else if(response.status === 460) {
                alert("El Cliente esta presentando problemas");
            } else if(response.status === 200) {
                alert("El Cliente ya ha sido usado para funciones del sistema.\n\nNo es posible eliminar.");
            }
        }

        if (status === 1000) setloading(false);
    };

    return (
        <Fragment>

            {
                loading && <Loading/>
            }
            <NewVehicle setModalNewVehicule={setModalNewVehicule} modalNewVehicule={modalNewVehicule}
                        typeVechicles={typeVechicles} clientActived={clientActived}/>
            <div className="row p-3">
                {
                    clients.map(x => (
                        <div className="col-12 item-vehicle-to-client">

                            <div className="d-flex justify-content-start align-items-center">
                                <button className="btn btn-sm btn-danger text-white mr-2" onClick={() => deleteClient(x)}>
                                    <span className="fa fa-trash text-white"/>
                                </button>
                                <div style={{width: '90%'}}>
                                    <b>Nombre: {x.name}</b><br/>
                                    <b>Número de identificación: {x.number}</b>
                                </div>
                            </div>
                            <br/>
                            <div className="d-flex justify-content-between align-items-center">
                                <b>Vehiculos:</b>
                                <button className="btn btn-sm btn-info text-white" onClick={() => {
                                    setModalNewVehicule('show');
                                    setclientActived(x.id);
                                }}>
                                    <span className="fa fa-plus text-white mr-1"/>
                                    Nuevo vehiculo
                                    <span className="fa fa-car text-white ml-1"/>
                                </button>
                            </div>
                            <table className="table table-hover mt-2">
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
                                            <td>
                                                <button className="btn btn-sm btn-danger" onClick={() => deleteVehicleClient(v)}>
                                                    <span className="fa fa-trash text-white"/>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : <tr>
                                        <td colSpan="4">No tiene vehiculos</td>
                                    </tr>
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
