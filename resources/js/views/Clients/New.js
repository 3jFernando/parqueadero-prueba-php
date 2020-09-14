import React, {useState, useEffect, Fragment} from 'react';

import {AxiosPOST, AxiosGET} from '../../services/Axios';

const New = props => {

    const [creating, setcreating] = useState("Crear cliente");
    const [name, setname] = useState("");
    const [number, setnumber] = useState("");

    // crear
    const create = e => {

        e.preventDefault();

        setcreating("Creando cliente, espera...");
        AxiosPOST('clients', {
            name, number
        }, callbackCreate);
    };
    const callbackCreate = (status, response) => {
        if(status === 200) {
            if(response.status === 200) {

                setname('');
                setnumber(1);

                alert("Cliente creado con exito.");
                if(props.hasOwnProperty('createFast')) {
                    props.setvehicles([]);
                    props.loadClients();
                    props.setmodalCreateClientsFast('hide');
                }

            } else if(response.status === 460) {
                alert("El número de identificación ingresado ya existe.");
            }
        }

        if(status === 1000) setcreating('Crear cliente');
    };

    return (
        <div className="card">
        <div className="card-body">
            <form onSubmit={e => create(e)}>
                <div className="form-group">
                    <label htmlFor="">Nombre copleto</label><br/>
                    <input className="form-control" type="text" required value={name} onChange={text => setname(text.target.value)} aria-describedby="helpname" placeholder="Nombre copleto"/>
                    <small>Nombre copleto. Campo obligatorio</small>
                </div>
                <div className="form-group">
                    <label htmlFor="">Número de identificación</label><br/>
                    <input className="form-control" type="text" required value={number} onChange={text => setnumber(text.target.value)} aria-describedby="helpid"
                           placeholder="Número de identificación"/>
                    <small id="helpid">Número de identificación. Campo obligatorio</small>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-sm btn-info text-white">
                        {creating}
                        <span className="fa fa-send ml-2 text-white"/>
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default New;
