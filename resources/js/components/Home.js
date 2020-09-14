import React, {Fragment, useState, useEffect} from 'react';

import moment from 'moment/dist/moment';

// servicios
import {AxiosPOST, AxiosGET} from '../services/Axios';

// componentes
import Loading from './Loading';
import ClientNewFast from "../views/Clients/New";
import NewVehicleToClient from "../views/Clients/Vehicles/New";

const Home = props => {

    const [loading, setloading] = useState(false);
    const [typeVechicles, setTypeVechicles] = useState([]);
    const [modalParking, setmodalParking] = useState('hide');
    const [useParkingLotRandom, setUseParkingLotRandom] = useState(false);
    const [modalBreakFreeParkingLot, setmodalBreakFreeParkingLot] = useState('hide');
    const [parkingLot0, setparkingLot0] = useState(null);
    const [parkingLot1, setparkingLot1] = useState(null);
    const [clients, setclients] = useState([]);

    useEffect(() => {
        setloading(true);
        loadParkingLot();
        loadClients();
    }, []);

    // cargar vahiculos - datos del estacionamiento
    const loadParkingLot = () => {
        setloading(true);
        AxiosGET('settings/vehicles', callbackLoadTypeVehicles);
    };
    const callbackLoadTypeVehicles = (status, response) => {
        if (status === 200) setTypeVechicles(response.types);

        if (status === 1000) setloading(false);
    };

    // cargar clientes
    const loadClients = () => {
        AxiosGET('clients', callbackLoadClients);
    };
    const callbackLoadClients = (status, response) => {
        if (status === 200) setclients(response.clients);
        if (status === 1000) setloading(false);
    };

    // hacer uso de un espacio de uno de los items del parqueadero
    const useSpace = (space, type, random) => {

        setUseParkingLotRandom(random);

        // liberar estacionamiento
        if (space.state === 1) {
            setparkingLot1({space, type});
            setmodalBreakFreeParkingLot('show');
        } else { // ocupar estacionamiento
            setparkingLot0({space, type});
            setmodalParking('show');
        }

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
                data={parkingLot0}
                modalParking={modalParking}
                setmodalParking={setmodalParking}
                clients={clients}
                loadParkingLot={loadParkingLot}
                loadClients={loadClients}
                typeVechicles={typeVechicles}
                useParkingLotRandom={useParkingLotRandom}
            />
            <ModalBreakFreeToSpacesParkingLot
                data={parkingLot1}
                loadParkingLot={loadParkingLot}
                modalBreakFreeParkingLot={modalBreakFreeParkingLot}
                setmodalBreakFreeParkingLot={setmodalBreakFreeParkingLot}
            />

            <div className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h2>Estacionamiento</h2>
                    </div>
                    <button type="button" onClick={() => useSpace('', '', true)} className="btn btn-sm btn-info text-white">
                        <span className="fa fa-car text-white mr-2"/> Ingresar vehiculo
                    </button>
                </div>
            </div>

            <br/>

            {/* parqueadero */}
            <div className="card">
                <div className="card-body">

                    <div className="d-flex align-items-center">
                        <div className="text-door text-center">
                            <b>ENTRADA</b>
                        </div>
                        <div>
                            {
                                typeVechicles.map(x => (
                                    <div key={x.id}>
                                        <h4 className="text-info">{x.type}</h4>
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
             onClick={() => useSpace(data, type, false)}
        >{data.transaction !== null ? data.transaction.code : ''}</div>
    );
};

// modal usar parquedero
const ModalActiosToSpacesParkingLot = props => {

    const [typeVehicle, settypeVehicle] = useState('');
    const [idSpace, setidSpace] = useState('');
    const [vehicles, setvehicles] = useState([]);
    const [client, setClient] = useState('');
    const [vehicle, setvehicle] = useState('');
    const [creatingTransaction, setcreatingTransaction] = useState('Ocupar estacionamiento');
    const [modalCreateClientsFast, setmodalCreateClientsFast] = useState('hide');
    const [modalCreateVehiclesToClientsFast, setmodalCreateVehiclesToClientsFast] = useState('hide');

    useEffect(() => {

       if(props.data !== null) {
           settypeVehicle(props.data.type.id);
           setidSpace(props.data.space.id);
       }
    });

    // cambiar cliente seleccioando
    const changeClient = value => {
        setClient(value);

        console.log("cliente ", value, ' typeVehicle ', typeVehicle);

        const _type = document.getElementById('id-type-vehicule').value;
        props.clients.filter(x => {
            if (x.id == value) setvehicles(x.vehicles.filter(v => v.id_type == _type));
        });
    };

    /*
    * crear transaccion
    * */
    const storeTransaction = e => {
        e.preventDefault();

        let type = typeVehicle;
        let space = idSpace;

        if(props.useParkingLotRandom) {
            type = document.getElementById('id-type-vehicule').value;
            space = '';
        }

        setcreatingTransaction("Creando transacción, espera...");
        AxiosPOST('parking-lot/transaction', {
            client, vehicle, idSpace:space, useParkingLotRandom: props.useParkingLotRandom, typeVehicle: type
        }, callbackCreate);
    };
    const callbackCreate = (status, response) => {
        if (status === 200) {
            if (response.status === 200) {

                setClient('');
                setvehicle('');
                setvehicles([]);

                props.loadParkingLot();
                props.setmodalParking('hide');

                alert("Proceso realizado con exito.");

            } else if (response.status === 460) {
                alert(`El espacio ${props.data.space.code} del parqueadero de ${props.data.type.type}, esta presentando problemas.`);
            } else if (response.status === 470) {
                alert(`El vehiculo seleccionado, esta presentando problemas.`);
            } else if (response.status === 480) {
                alert(`El cliente seleccionado, esta presentando problemas.`);
            }
        }

        if (status === 1000) setcreatingTransaction('Ocupar estacionamiento');
    };

    /*
    * Crear clientes rapidos
    * */
    const openModalCreateClientFast = data => {
        setmodalCreateClientsFast('show');
    };

    /*
    * Crear vehiculos para los clientes rapidos
    * */
    const openModalCreateVehicleToFast = data => {

        if (client === null || client === '' || client === undefined) {
            alert("Primero debes seleccionar un Cliente.\n\n* Recuerda que el Vehiculo debe estar relacionado a un cliente");
            return false;
        }

        setmodalCreateVehiclesToClientsFast('show');
    };

    /*
    * cerrar modal
    * */
    const closeModal = () => {
        setvehicle('');
        setClient('');
        setvehicles([]);
        setidSpace('');
        settypeVehicle('');
        props.setmodalParking('hide');
    };

    return props.data !== null && (
        <div className={`modal fade ${props.modalParking}`}
             style={props.modalParking === 'show' ? {display: 'flex'} : {display: 'none'}} id="staticBackdrop"
             data-backdrop="static" data-keyboard="false" tabIndex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog w-100">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Usar estacionamiento <span
                            className="fa fa-car text-info ml-2"/></h5>
                        <button type="button" onClick={() => closeModal()} className="close"
                                data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <ModalCreateClientFast
                            modalCreateClientsFast={modalCreateClientsFast}
                            setmodalCreateClientsFast={setmodalCreateClientsFast}
                            loadClients={props.loadClients}
                            setvehicles={setvehicles}
                        />

                        <ModalCreateVehiclesToClientFast
                            modalCreateVehiclesToClientsFast={modalCreateVehiclesToClientsFast}
                            setmodalCreateVehiclesToClientsFast={setmodalCreateVehiclesToClientsFast}
                            loadClients={props.loadClients}
                            client={client}
                            setClient={setClient}
                            typeVechicles={props.typeVechicles}
                            vehicles={vehicles}
                            setvehicles={setvehicles}
                        />

                        <form onSubmit={e => storeTransaction(e)}>
                            <div className="form-group">
                                <label htmlFor="">Estacionamiento</label>
                                <br/>
                                <div className="d-flex justify-content-start align-items-center">
                                    <select className="form-control"
                                            disabled={!props.useParkingLotRandom}
                                            required
                                            id="id-type-vehicule"
                                            value={typeVehicle}
                                            onChange={text => settypeVehicle(text.target.value)}>
                                        <option value="">...</option>
                                        {
                                            props.typeVechicles.map(x => <option key={x.id}
                                                                                 value={x.id}>{x.type}</option>)
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="">Cliente</label>
                                <br/>
                                <div className="d-flex justify-content-start align-items-center">
                                    <select className="form-control" required value={client}
                                            onChange={text => changeClient(text.target.value)}>
                                        <option value="">...</option>
                                        {
                                            props.clients.map(x => <option key={x.id}
                                                                           value={x.id}>{x.number} - {x.name}</option>)
                                        }
                                    </select>
                                    <button type="button" className="btn btn-sm btn-info ml-2"
                                            onClick={() => openModalCreateClientFast(props.data)}>
                                        <span className="fa fa-user-plus text-white"/>
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="">Vehiculo</label>
                                <br/>
                                <div className="d-flex justify-content-start align-items-center mt-2">
                                    <select className="form-control" required value={vehicle}
                                            onChange={text => setvehicle(text.target.value)}>
                                        <option value="">...</option>
                                        {
                                            vehicles.map(x => <option key={x.id}
                                                                      value={x.id}>{x.code}</option>)
                                        }
                                    </select>
                                    <button type="button" className="btn btn-sm btn-info ml-2"
                                            onClick={() => openModalCreateVehicleToFast(props.data)}>
                                        <span className="fa fa-car text-white"/>
                                    </button>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-light" data-dismiss="modal"
                                        onClick={() => closeModal()}>Cancelar
                                </button>
                                <button type="submit"
                                        className="btn btn-sm btn-info text-white">{creatingTransaction}</button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
};

// modal crear clientes rapidos
const ModalCreateClientFast = props => {
    return (
        <div
            className={`modal fade ${props.modalCreateClientsFast}`}
            style={props.modalCreateClientsFast === 'show' ? {display: 'flex'} : {display: 'none'}}
            id="staticBackdrop"
            data-backdrop="static"
            data-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">

            <div className="modal-dialog w-100">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Crear cliente</h5>
                        <button type="button" onClick={() => props.setmodalCreateClientsFast('hide')} className="close"
                                data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <ClientNewFast
                            createFast={true}
                            loadClients={props.loadClients}
                            setmodalCreateClientsFast={props.setmodalCreateClientsFast}
                            setvehicles={props.setvehicles}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
};

// modal crear vehiculos para los clientes rapidos
const ModalCreateVehiclesToClientFast = props => {
    return (
        <NewVehicleToClient
            typeVechicles={props.typeVechicles}
            createFast={true}
            loadClients={props.loadClients}
            client={props.client}
            setClient={props.setClient}
            modalNewVehicule={props.modalCreateVehiclesToClientsFast}
            setModalNewVehicule={props.setmodalCreateVehiclesToClientsFast}
            vehicles={props.vehicles}
            setvehicles={props.setvehicles}
        />
    );
};

// modal liberar parquedero
const ModalBreakFreeToSpacesParkingLot = props => {

    const [toDay, settoDay] = useState();
    const [time, setTime] = useState();
    const [breakFreeParkingLot, setbreakFreeParkingLot] = useState('Liberar estacionamiento');
    const [totalToPay, settotalToPay] = useState(0);

    useEffect(() => {
        if (props.data !== null) {

            const since = moment().format('MM/DD/YYYY H:mm:ss');
            const until = moment(props.data.space.transaction.date_start).format('MM/DD/YYYY HH:mm:ss');
            settoDay(since);

            const _timeTotal = getTimeBetweenDateStartAndEnd(since, until);
            setTime(_timeTotal);
            const total = _timeTotal > 0 ? (parseFloat(props.data.type.rate) * parseFloat(_timeTotal)) : props.data.type.rate;

            settotalToPay(total);

        }
    });

    // calcular tiempor entre dos fechas
    const getTimeBetweenDateStartAndEnd = (since, until) => {
        var diff = moment.duration(moment(since).diff(moment(until)));
        var days = parseInt(diff.asDays()); //84
        var hours = parseInt(diff.asHours()); //2039 hours, but it gives total hours in given miliseconds which is not expacted.
        hours -= days * 24;  // 23 hours
        var minutes = parseInt(diff.asMinutes()); //122360 minutes,but it gives total minutes in given miliseconds which is not expacted.
        minutes -= (days * 24 * 60 + hours * 60); //20 minutes.

        return minutes;
    };

    // liberar estacionamiento, cerrar transaccion
    const handlerBreakFreeParkingLot = () => {

        const cBreakFree = confirm('¿Seguro que deseas liberar el estacionamiento?');
        if (!cBreakFree) return false;

        setbreakFreeParkingLot("Procesando, espera...");
        AxiosPOST('parking-lot/transaction/breakfree', {
            idTransaction: props.data.space.transaction.id,
            date_end: toDay,
            total: totalToPay,
            time,
            parkinglot: props.data.space.transaction.parkinglot,
            idtd: props.data.space.transaction.idtd
        }, callbackCreate);
    };
    const callbackCreate = (status, response) => {
        if (status === 200) {
            if (response.status === 200) {
                alert("Proceso realizado con exito.");
                props.loadParkingLot();
                props.setmodalBreakFreeParkingLot('hide')

            } else if (response.status === 470) {
                alert(`La Transacción seleccionado, esta presentando problemas.`);
            }
        }

        if (status === 1000) setbreakFreeParkingLot('Liberar estacionamiento');
    };

    return props.data !== null && (
        <div className={`modal fade ${props.modalBreakFreeParkingLot}`}
             style={props.modalBreakFreeParkingLot === 'show' ? {display: 'flex'} : {display: 'none'}}
             id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabIndex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog w-100">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Liberar estacionamiento</h5>
                        <button type="button" onClick={() => props.setmodalBreakFreeParkingLot('hide')}
                                className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <div className="form-group">
                            <label htmlFor="">Cliente</label>
                            <br/>
                            <input type="text" className="form-control" value={props.data.space.transaction.name}
                                   disabled/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="">Vehiculo</label>
                            <br/>
                            <input type="text" className="form-control"
                                   value={`${props.data.space.transaction.code} | ${props.data.type.type}`} disabled/>
                        </div>

                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 colsm-12">
                                <label htmlFor="">Fecha Ingreso</label>
                                <br/>
                                <input type="text" className="form-control"
                                       value={moment(props.data.space.transaction.date_start).format('MM/DD/YYYY HH:mm:ss')}
                                       disabled/>
                            </div>
                            <div className="form-group col-lg-6 col-md-6 colsm-12">
                                <label htmlFor="">Fecha Salida</label>
                                <br/>
                                <input type="text" className="form-control" value={toDay}
                                       onChange={text => settoDay(text.target.value)} disabled/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 colsm-12">
                                <label htmlFor="">Tiempo en estacionamiento</label>
                                <br/>
                                <input type="text" className="form-control" value={time}
                                       onChange={text => setTime(text.target.value)} disabled
                                       aria-describedby="timehelp"/>
                                <small id="timehelp">Tiempo en Minutos</small>
                            </div>
                            <div className="form-group col-lg-6 col-md-6 colsm-12">
                                <label htmlFor="">Valor a Pagar</label>
                                <br/>
                                <input type="text" className="form-control" value={totalToPay}
                                       onChange={text => settotalToPay(text.target.value)} disabled/>
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-light" data-dismiss="modal"
                                onClick={() => props.setmodalBreakFreeParkingLot('hide')}>Cancelar
                        </button>
                        <button type="submit" className="btn btn-sm btn-info text-white"
                                onClick={() => handlerBreakFreeParkingLot()}>{breakFreeParkingLot}</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Home;
