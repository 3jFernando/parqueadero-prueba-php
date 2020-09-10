import React, {useState} from 'react';
import {AxiosPOST} from "../../../services/Axios";

const New = props => {

    const [creating, setCreating] = useState('Crear Vehiculo');
    const [type, setType] = useState('');
    const [code, setCode] = useState('');

    // crear tipo
    const create = e => {

        e.preventDefault();

        setCreating("Creando vehiculo, espera...");
        AxiosPOST('clients/vehicles', {
            type, code, idClient: props.clientActived
        }, callbackCreate);
    };
    const callbackCreate = (status, response) => {
        if (status === 200) {
            window.location.reload();
            alert("Vehiculo creado con exito.");
        }

        if (status === 1000) setCreating('Crear Vehiculo');
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
                        <button type="button" onClick={() => props.setModalNewVehicule('hide')} className="close"
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
                                        onClick={() => props.setModalNewVehicule('hide')}>Cancelar
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
