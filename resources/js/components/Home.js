import React, {Fragment, useState, useEffect} from 'react';

import moment from 'moment/dist/moment';

// servicios
import {AxiosPOST, AxiosGET} from '../services/Axios';

// componentes
import Loading from './Loading';

const Settings = props => {

    const [loading, setloading] = useState(false);
    const [typeVechicles, setTypeVechicles] = useState([]);
    const [modalParking, setmodalParking] = useState('hide');
    const [modalBreakFreeParkingLot, setmodalBreakFreeParkingLot] = useState('hide');
    const [parkingLot0, setparkingLot0] = useState(null);
    const [parkingLot1, setparkingLot1] = useState(null);
    const [clients, setclients] = useState([]);

    useEffect(() => {
        setloading(true);
        loadParkingLot();
        AxiosGET('clients', callbackLoadClients);
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
    const callbackLoadClients = (status, response) => {
        if(status === 200) setclients(response.clients);
        if(status === 1000) setloading(false);
    };

    // hacer uso de un espacio de uno de los items del parqueadero
    const useSpace = (space, type) => {

        // ocupar estacionamiento
        if(space.state === 0) {
            setparkingLot0({space,type});
            setmodalParking('show');
        } else { // liberar estacionamiento
            setparkingLot1({space,type});
            setmodalBreakFreeParkingLot('show');
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
            />
            <ModalBreakFreeToSpacesParkingLot
                data={parkingLot1}
                loadParkingLot={loadParkingLot}
                modalBreakFreeParkingLot={modalBreakFreeParkingLot}
                setmodalBreakFreeParkingLot={setmodalBreakFreeParkingLot}
            />

            <div className="card card-body">
                <h2>Estacionamiento</h2>
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
             onClick={() => useSpace(data, type)}
         />
    );
};

// modal usar parquedero
const ModalActiosToSpacesParkingLot = props => {

    const [vehicles, setvehicles] = useState([]);
    const [client, setClient] = useState('');
    const [vehicle, setvehicle] = useState('');
    const [creatingTransaction, setcreatingTransaction] = useState('Ocupar estacionamiento');

    // cambiar cliente seleccioando
    const changeClient = value => {
        setClient(value);
        props.clients.filter(x => {
            if(x.id == value) setvehicles(x.vehicles);
        });
    };

    /*
    * crear transaccion
    * */
    const storeTransaction = e => {
        e.preventDefault();

        setcreatingTransaction("Creando transacción, espera...");
        AxiosPOST('parking-lot/transaction', {
            client, vehicle, idSpace: props.data.space.id
        }, callbackCreate);
    };
    const callbackCreate = (status, response) => {
        if(status === 200) {
            if(response.status === 200) {
                alert("Proceso realizado con exito.");
                props.loadParkingLot();
                props.setmodalParking('hide')

            } else if(response.status === 460) {
                alert(`El espacio ${props.data.space.code} del parqueadero de ${props.data.type.type}, esta presentando problemas.`);
            } else if(response.status === 470) {
                alert(`El vehiculo seleccionado, esta presentando problemas.`);
            } else if(response.status === 480) {
                alert(`El cliente seleccionado, esta presentando problemas.`);
            }
        }

        if(status === 1000) setcreatingTransaction('Ocupar estacionamiento');
    };

    return props.data !== null && (
        <div className={`modal fade ${props.modalParking}`} style={props.modalParking === 'show' ? {display: 'flex'} : {display: 'none'} } id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabIndex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog w-100">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{props.data.type.type} - Espacio {props.data.space.code} </h5>
                        <button type="button" onClick={() => props.setmodalParking('hide')} className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <form onSubmit={e => storeTransaction(e)}>
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
                            </div>

                            <div className="form-group">
                                <label htmlFor="">Vehiculo</label>
                                <br/>
                                <div className="d-flex justify-content-start align-items-center mt-2">
                                    <select className="form-control" value={vehicle} onChange={text => setvehicle(text.target.value)}>
                                        <option value="">...</option>
                                        {
                                            vehicles.map(x => <option key={x.id} value={x.id}>{x.code} - {x.type}</option>)
                                        }
                                    </select>
                                    <button className="btn btn-sm btn-info ml-2">
                                        <span className="fa fa-plus text-white" />
                                    </button>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-light" data-dismiss="modal" onClick={() => props.setmodalParking('hide')}>Cancelar</button>
                                <button type="submit" className="btn btn-sm btn-info text-white">{creatingTransaction}</button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
};

// modal liberar parquedero
const ModalBreakFreeToSpacesParkingLot = props => {

    const [toDay, settoDay] = useState();
    const [time, setTime] = useState();
    const [breakFreeParkingLot, setbreakFreeParkingLot] = useState('Liberar estacionamiento');
    const [totalToPay, settotalToPay] = useState(0);

    useEffect(() => {
        if(props.data !== null) {

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
        hours -= days*24;  // 23 hours
        var minutes = parseInt(diff.asMinutes()); //122360 minutes,but it gives total minutes in given miliseconds which is not expacted.
        minutes -= (days*24*60 + hours*60); //20 minutes.

        return minutes;
    };

    // liberar estacionamiento, cerrar transaccion
    const handlerBreakFreeParkingLot = () => {

        const cBreakFree = confirm('¿Seguro que deseas liberar el estacionamiento?');
        if(!cBreakFree) return false;

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
        if(status === 200) {
            if(response.status === 200) {
                alert("Proceso realizado con exito.");
                props.loadParkingLot();
                props.setmodalBreakFreeParkingLot('hide')

            } else if(response.status === 470) {
                alert(`La Transacción seleccionado, esta presentando problemas.`);
            }
        }

        if(status === 1000) setbreakFreeParkingLot('Liberar estacionamiento');
    };

    return props.data !== null && (
        <div className={`modal fade ${props.modalBreakFreeParkingLot}`} style={props.modalBreakFreeParkingLot === 'show' ? {display: 'flex'} : {display: 'none'} } id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabIndex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog w-100">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Liberar estacionamiento</h5>
                        <button type="button" onClick={() => props.setmodalBreakFreeParkingLot('hide')} className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <div className="form-group">
                            <label htmlFor="">Cliente</label>
                            <br/>
                            <input type="text" className="form-control" value={props.data.space.transaction.name} disabled/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="">Vehiculo</label>
                            <br/>
                            <input type="text" className="form-control" value={`${props.data.space.transaction.code} | ${props.data.type.type}`} disabled/>
                        </div>

                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 colsm-12">
                                <label htmlFor="">Fecha Ingreso</label>
                                <br/>
                                <input type="text" className="form-control" value={moment(props.data.space.transaction.date_start).format('MM/DD/YYYY HH:mm:ss')} disabled/>
                            </div>
                            <div className="form-group col-lg-6 col-md-6 colsm-12">
                                <label htmlFor="">Fecha Salida</label>
                                <br/>
                                <input type="text" className="form-control" value={toDay} onChange={text => settoDay(text.target.value)} disabled/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 colsm-12">
                                <label htmlFor="">Tiempo en estacionamiento</label>
                                <br/>
                                <input type="text" className="form-control" value={time} onChange={text => setTime(text.target.value)} disabled aria-describedby="timehelp"/>
                                <small id="timehelp">Tiempo en Minutos</small>
                            </div>
                            <div className="form-group col-lg-6 col-md-6 colsm-12">
                                <label htmlFor="">Valor a Pagar</label>
                                <br/>
                                <input type="text" className="form-control" value={totalToPay} onChange={text => settotalToPay(text.target.value)} disabled/>
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-sm btn-light" data-dismiss="modal" onClick={() => props.setmodalBreakFreeParkingLot('hide')}>Cancelar</button>
                        <button type="submit" className="btn btn-sm btn-info text-white" onClick={() => handlerBreakFreeParkingLot()}>{breakFreeParkingLot}</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Settings;
