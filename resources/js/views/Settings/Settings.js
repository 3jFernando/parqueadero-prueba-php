import React, {Fragment, useState, useEffect} from 'react';

// servicios
import {AxiosPOST, AxiosGET} from '../../services/Axios';

// componentes
import Loading from '../../components/Loading';

const Settings = props => {
    const [loading, setloading] = useState(false);
    const [editing, setediting] = useState(false);
    const [creating, setcreating] = useState('Crear tipo');
    const [itemEditingID, setitemEditingID] = useState(null);
    const [typeVechicles, setTypeVechicles] = useState([]);
    const [type, settype] = useState('');
    const [cant, setcant] = useState(1);
    const [rate, setrate] = useState(0);

    useEffect(() => {
        setloading(true);
        AxiosGET('settings/vehicles', callbackLoadTypeVehicles);
    }, []);

    // cargar vahiculos
    const callbackLoadTypeVehicles = (status, response) => {
        if (status === 200) setTypeVechicles(response.types);

        if (status === 1000) setloading(false);
    };

    // crear tipos de vaiculos
    const create = e => {

        e.preventDefault();

        setcreating("Creando, espera...");
        AxiosPOST('settings/vehicles', {
            type, cant, rate, editing, itemEditingID
        }, callbackCreate);
    };
    const callbackCreate = (status, response) => {
        if (status === 200) {
            if (response.status === 200) {

                settype('');
                setcant(1);
                setrate(0);

                const _types = editing ? [...typeVechicles.filter(x => x.id !== response.type.id), response.type] : [...typeVechicles, response.type];

                setTypeVechicles(_types);
                cancelEdit();

                alert(editing ? "Cambios guardados con exito." : "Item creado con exito.");

            } else if (response.status === 460) {
                alert("El tipo ingresado ya exite.");
            }
        }

        if (status === 1000) setcreating('Crear tipo');
    };

    // editar tipo
    const edit = item => {
        setediting(true);
        setcreating('Guardar cambios');

        setitemEditingID(item.id);
        settype(item.type);
        setcant(item.cant);
        setrate(item.rate);

    };

    // cancelar editar tipo
    const cancelEdit = () => {
        setediting(false);
        setcreating('Crear tipo');

        settype('');
        setcant(1);
        setrate(0);

    };

    // eliminar tipo
    const destroy = id => {

        const cDelete = confirm('¿Seguro que deseas eliminar el Tipo?');
        if (!cDelete) return false;

        setloading(true);
        AxiosPOST('settings/vehicles/destroy', {
            id
        }, callbackDestroy);
    };
    const callbackDestroy = (status, response) => {
        if (status === 200) {
            if (response.status === 200) {

                const _types = typeVechicles.filter(x => x.id !== response.id);
                setTypeVechicles(_types);

                alert("Tipo eliminado con exito.");
            } else if (response.status === 460) {
                alert("El tipo no existe.");
            }
        }

        if (status === 1000) setloading(false);
    };

    return (
        <div className="container">

            <div className="card card-body">
                <h2>Configurar estacionamientos</h2>
            </div>

            <br/>

            {/* agregar tipos de vehiculos */}
            <div className="card card-body">
                <div className="alert alert-info" style={editing ? {display: 'block'} : {display: 'none'}}>
                    <span>Solo es permitido modificar la <b>Tarifa por minuto</b></span>
                </div>
                <form onSubmit={(e) => create(e)}>
                    <div className="row">
                        <div className="form-group col-lg-4 col-md-4 col-ms-12">
                            <label htmlFor="">Tipo</label><br/>
                            <input type="text" autoFocus required disabled={editing} className="form-control"
                                   value={type}
                                   onChange={text => settype(text.target.value)} placeholder="tipo"/>
                        </div>
                        <div className="form-group col-lg-4 col-md-4 col-ms-12">
                            <label htmlFor="">Cantidad (espacios)</label><br/>
                            <input type="number" required disabled={editing} className="form-control" value={cant}
                                   onChange={text => setcant(text.target.value)}
                                   placeholder="Cantidad (espacios), estacionamientos"/>
                        </div>
                        <div className="form-group col-lg-4 col-md-4 col-ms-12">
                            <label htmlFor="">Tarifa por minuto</label><br/>
                            <input type="number" required className="form-control" value={rate}
                                   onChange={text => setrate(text.target.value)} placeholder="Tarifa por minuto"/>
                        </div>
                    </div>
                    <div className="d-flex">
                        <button type="submit" className="btn btn-sm btn-info text-white">
                            {creating}
                            <span className="fa fa-plus ml-2 text-white"/>
                        </button>
                        <button type="button"
                                className="btn btn-sm btn-light ml-2"
                                style={editing ? {display: 'block'} : {display: 'none'}}
                                onClick={() => cancelEdit()}>
                            Cancelar
                            <span className="fa fa-cancel-circle ml-2"/>
                        </button>
                    </div>
                </form>

            </div>

            {/* tipos de vehiculos */}
            <div className="card mt-2">
                <div className="table-responsive card-body">
                    {
                        loading && <Fragment>
                            <Loading/>
                            <br/>
                        </Fragment>
                    }
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Tipo</th>
                            <th>Cantidad (espacios)</th>
                            <th>Tarifa por minuto</th>
                            <th>Eliminar</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            typeVechicles.map(x => (
                                <tr>
                                    <td>{x.id}</td>
                                    <td>{x.type}</td>
                                    <td>{x.cant}</td>
                                    <td>{x.rate}</td>
                                    <td>
                                        <button className="btn btn-light btn-sm" onClick={() => edit(x)}>
                                            <span className="fa fa-edit text-info"/>
                                        </button>
                                        <button className="btn btn-danger btn-sm ml-2" onClick={() => destroy(x.id)}>
                                            <span className="fa fa-trash"/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default Settings;
