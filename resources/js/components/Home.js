import React, {Fragment, useState, useEffect} from 'react';

// servicios
import {AxiosPOST, AxiosGET} from '../services/Axios';

// componentes
import Loading from './Loading';

const Settings = props => {

    const [loading, setloading] = useState(false);
    const [typeVechicles, setTypeVechicles] = useState([]);
    const [modalParking, setmodalParking] = useState('hide');
    const [dataSpaceActive, setdataSpaceActive] = useState(null);
    const [clients, setclients] = useState([]);

    useEffect(() => {
        setloading(true);
        AxiosGET('settings/vehicles', callbackLoadTypeVehicles);
        setloading(true);
        AxiosGET('clients', callbackLoadClients);
    }, []);

    // cargar vahiculos
    const callbackLoadTypeVehicles = (status, response) => {
        if (status === 200) setTypeVechicles(response.types);

        if (status === 1000) setloading(false);
    };

    // cargar clientes
    const callbackLoadClients = (status, response) => {
        if(status === 200) setclients(response.clients);
        if(status === 1000) setloading(false);
    };

    // hacer uso de un espacio de uno de los items del parqueadero
    const useSpace = (space, type) => {

        setmodalParking('show');
        setdataSpaceActive({
            space,type
        });

        /*let dateStart = "";
        let hourStart = "";

        let message = `¿Seguro que deseas OCUPAR el espacio en el parqueadero de ${type.type}?
        \n\nDatos de ingreso:
        \nFecha: ${dateStart}
        \nHora: ${hourStart}`;

        if(space.state === 1) {
            message = `¿Seguro que deseas LIBERAR el espacio en el parqueadero de ${type.type}?`;
        }
        const useConfirm = confirm(message);
        if(!useConfirm) return false;

        setloading(true);
        AxiosPOST('parking-lot/space/change-state', {
            id: space.id
        }, callbackUseSpace);*/
    };
    const callbackUseSpace = (status, response) => {
        if (status === 200) {
            if (response.status === 200) {
                document.getElementById(`item-space-${response.space.id}-${response.space.code}`).classList.toggle('space-item-free');
            } else if (response.status === 460) {
                alert("El espacio en parquedero, ya se encuentra ocupado.");
            }
        }

        if (status === 1000) setloading(false);
    };

    return (
        <Fragment>

            <ModalActiosToSpacesParkingLot
                data={dataSpaceActive}
                modalParking={modalParking}
                setmodalParking={setmodalParking}
                clients={clients}
            />

            <div className="card card-body">
                <h2>Parqueadero</h2>
            </div>

            <br/>

            {/* parqueadero */}
            <div className="card">
                <div className="card-body">

                    <div className="d-flex align-items-center">
                        <div className="text-door">
                            <b>ENTRADA</b>
                        </div>
                        <div>
                            {
                                typeVechicles.map(x => (
                                    <div key={x.id}>
                                        <h4 className="text-info">{x.type} - ({x.cant})</h4>
                                        <div className="row">
                                            {
                                                x.details.map(d => <Items key={d.id} type={x} data={d}
                                                                          useSpace={useSpace}/>)
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    {
                        loading && <Fragment>
                            <br/>
                            <Loading/>
                        </Fragment>
                    }

                </div>
            </div>

        </Fragment>
    );
};

// cada item o espacio de un parqueadero
const Items = ({type, data, useSpace}) => {

    return (
        <div id={`item-space-${data.id}-${data.code}`}
             className={data.state === 0 ? "space-item col-2 space-item-free" : "space-item col-2"}
             onClick={() => useSpace(data, type)}
        >{data.code}</div>
    );
};

// modal, acciones sobre espacios del parquedero
const ModalActiosToSpacesParkingLot = props => {

    const [veichles, setveichles] = useState([]);
    const [client, setClient] = useState('');
    const [veichle, setVeichle] = useState('');

    // cambiar cliente seleccioando
    const changeClient = value => {
        setClient(value);
        props.clients.filter(x => {
            if(x.id == value) setveichles(x.vehicles);
        });
    };

    return props.data !== null && (
        <div className={`modal fade ${props.modalParking}`} style={props.modalParking === 'show' ? {display: 'flex'} : {display: 'none'} } id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabIndex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog w-100">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{props.data.type.type} - Espacio {props.data.space.code} {props.data.space.state === 0 ? 'Libre' : 'Ocupado'} </h5>
                        <button type="button" onClick={() => props.setmodalParking('hide')} className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <div className="form-group">
                            <label htmlFor="">Cliente</label>
                            <br/>
                            <div className="d-flex justify-content-start align-items-center">
                                <select className="form-control" value={client} onChange={text => changeClient(text.target.value)}>
                                    <option value="">...</option>
                                    {
                                        props.clients.map(x => <option key={x.id} value={x.id}>{x.number} - {x.name}</option>)
                                    }
                                </select>
                                <button className="btn btn-sm btn-info ml-2">
                                    <span className="fa fa-plus text-white" />
                                </button>
                            </div>

                            <div className="d-flex justify-content-start align-items-center mt-2">
                                <select className="form-control" value={veichle} onChange={text => setVeichle(text.target.value)}>
                                    <option value="">...</option>
                                    {
                                        veichles.map(x => <option key={x.id} value={x.id}>{x.code} - {x.type}</option>)
                                    }
                                </select>
                                <button className="btn btn-sm btn-info ml-2">
                                    <span className="fa fa-plus text-white" />
                                </button>
                            </div>

                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-light" data-dismiss="modal" onClick={() => props.setmodalParking('hide')}>Cancelar</button>
                        <button type="button" className="btn btn-sm btn-info text-white">{props.data.space.state === 0 ? 'Ocupar' : 'Liberar'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Settings;
