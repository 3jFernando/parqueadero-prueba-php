import React, {Fragment, useState, useEffect} from 'react';

// servicios
import {AxiosPOST, AxiosGET} from '../../services/Axios';

// componentes
import Loading from '../../components/Loading';

const Settings = props => {
    const [loading, setloading] = useState(false);
    const [creating, setcreating] = useState('Crear tipo');
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
        if(status === 200) setTypeVechicles(response.types);

        if(status === 1000) setloading(false);
    };

    // crear tipos de vaiculos
    const create = e => {

        e.preventDefault();

        setcreating("Creando, espera...");
        AxiosPOST('settings/vehicles', {
            type, cant, rate
        }, callbackCreate);
    };
    const callbackCreate = (status, response) => {
        if(status === 200) {
            if(response.status === 200) {

                settype('');
                setcant(1);
                setrate(0);

                const _types = [...typeVechicles, response.type];
                setTypeVechicles(_types);

                alert("Tipo de vehiculo creado con exito.");
            } else if(response.status === 460) {
                alert("El tipo de vehiclo ya existe.");
            }
        }

        if(status === 1000) setcreating('Crear tipo');
    };

    // eliminar tipo
    const destroy = id => {

        const cDelete = confirm('¿Seguro que deseas eliminar el Tipo?');
        if(!cDelete) return false;

        setloading(true);
        AxiosPOST('settings/vehicles/destroy', {
            id
        }, callbackDestroy);
    };
    const callbackDestroy = (status, response) => {
        if(status === 200) {
            if(response.status === 200) {

                const _types = typeVechicles.filter(x => x.id !== response.id);
                setTypeVechicles(_types);

                alert("Tipo de vehiculo eliminado con exito.");
            } else if(response.status === 460) {
                alert("El tipo de vehiclo no existe.");
            }
        }

        if(status === 1000) setloading(false);
    };

    return(
        <Fragment>

            <div className="card card-body">
                <h2>Configurar estacionamientos</h2>
            </div>

            <br/>

            {/* agregar tipos de vehiculos */}
            <div className="card card-body">
                <form  onSubmit={(e) => create(e)}>
                    <div className="form-group">
                        <label htmlFor="">Tipo</label><br/>
                        <input type="text" autoFocus required className="form-control" value={type} onChange={text => settype(text.target.value)} placeholder="tipo"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Cantidad (espacios)</label><br/>
                        <input type="number" required className="form-control" value={cant} onChange={text => setcant(text.target.value)} placeholder="Cantidad (espacios), estacionamientos"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="">Tarifa por minuto</label><br/>
                        <input type="number" required className="form-control" value={rate} onChange={text => setrate(text.target.value)} placeholder="Tarifa por minuto"/>
                    </div>
                    <button type="submit" className="btn btn-block btn-info">
                        {creating}
                        <span className="fa fa-plus ml-2" />
                    </button>
                </form>

            </div>

            {/* tipos de vehiculos */}
            <div className="table-responsive">
                {
                    loading && <Fragment>
                        <Loading />
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
                                    <button className="btn btn-danger btn-sm" onClick={() => destroy(x.id)}>
                                        <span className="fa fa-trash" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>

        </Fragment>
    );
}

export default Settings;
