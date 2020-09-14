import React, {useState, useEffect} from 'react';
import {AxiosPOST} from "../../../services/Axios";

const New = props => {

    const [creating, setCreating] = useState('Crear Vehiculo');
    const [type, setType] = useState('');
    const [code, setCode] = useState('');

    // crear tipo
    const create = e => {

        e.preventDefault();

        let idClient = props.clientActived;
        if(props.hasOwnProperty('createFast')) idClient = props.client;

        setCreating("Creando vehiculo, espera...");
        AxiosPOST('clients/vehicles', {
            type, code, idClient
        }, callbackCreate);
    };
    const callbackCreate = (status, response) => {
        if (status === 200) {

            if(response.status === 200) {

                if(props.hasOwnProperty('createFast')) {
                    props.setvehicles([...props.vehicles, response.vehicle]);
                    closeModal();
                } else {
                    window.location.reload();
                }

                alert("Vehiculo creado con exito.");

            } else if(response.status === 460) {
                alert("La Placa/Serial ingresado ya se encuentra asociado a un Vehiculo de este cliente.");
            }
        }

        if (status === 1000) setCreating('Crear Vehiculo');
    };

    /*
    * cerrar modal
    * */
    const closeModal = () => {
        setType('');
        setCode('');
        props.setModalNewVehicule('hide');
    };

    return (
        <div className={`modal fade ${props.modalNewVehicule}`}
             style={props.modalNewVehicule === 'show' ? {display: 'flex'} : {display: 'none'}} id="staticBackdrop"
             data-backdrop="static" data-keyboard="false" tabIndex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog w-100">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Agregar Vehiculo</h5>
                        <button type="button" onClick={() => closeModal()} className="close"
                                data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <form onSubmit={e => create(e)}>
                            <div className="form-group">
                                <label htmlFor="">Tipo de Vehiculo</label>
                                <br/>
                                <select className="form-control" required value={type}
                                        onChange={text => setType(text.target.value)}>
                                    <option value="">...</option>
                                    {
                                        props.typeVechicles.map(x => <option key={x.id} value={x.id}>{x.type}</option>)
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Placa o Serial del Vehiculo</label>
                                <br/>
                                <input type="text" required className="form-control" value={code}
                                       onChange={text => setCode(text.target.value)}/>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-light" data-dismiss="modal"
                                        onClick={() => closeModal()}>Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-info text-white"
                                >{creating}</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default New;
