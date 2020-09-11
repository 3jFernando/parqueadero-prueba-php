import React, {useState, Fragment, useEffect} from 'react';

import Loading from "../../components/Loading";
import {AxiosPOST} from "../../services/Axios";

const Reports = props => {

    const [menu, setMenu] = useState(1);
    const [loading, setLoading] = useState(false);
    const [since, setSince] = useState('');
    const [until, setUntil] = useState('');

    // reportes
    const [reports, setReports] = useState([]);

    const handleSearchResults = e => {

        setReports([]);
        e.preventDefault();
        setLoading(true);

        let endpoint = "reports/most-used-parking";
        if(menu === 2) {
            endpoint = "reports/entry-and-exit-transactions";
        } else if (menu === 3) {
            endpoint = "reports/number-of-vehicles-entered";
        } else if (menu === 4) {
            endpoint = "reports/amount-obtained-per-day";
        }

        AxiosPOST(endpoint, {
            since, until
        }, callbackLoadData);
    };
    const callbackLoadData = (status, response) => {
        if (status === 200) {
            setReports(response.data);
        }

        if (status === 1000) setLoading(false);
    };

    return (
        <div>

            <ul className="nav">
                <li className="nav-item">
                    <button
                        className={menu === 1 ? "btn btn-light nav-link active ml-1" : "btn btn-light nav-link ml-1"}
                        onClick={() => {setMenu(1); setReports([]);}}>Parqueadero más usado
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={menu === 2 ? "btn btn-light nav-link active ml-1" : "btn btn-light nav-link ml-1"}
                        onClick={() => {setMenu(2); setReports([]);}}>Transacciones de entrada y salida
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={menu === 3 ? "btn btn-light nav-link active ml-1" : "btn btn-light nav-link ml-1"}
                        onClick={() => {setMenu(3); setReports([]);}}>Cantidad de vehículos por tipos que han ingresado
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={menu === 4 ? "btn btn-light nav-link active ml-1" : "btn btn-light nav-link ml-1"}
                        onClick={() => {setMenu(4); setReports([]);}}>Monto obtenido por día
                    </button>
                </li>
            </ul>

            <br/>

            <div className="card">
                <div className="card-body">
                    <form className="row" onSubmit={e => handleSearchResults(e)}>
                        <div className="form-group col-lg-5 col-md-5 col-ms-12">
                            <label htmlFor="exampleInputEmail1">Fecha desde</label>
                            <input type="date" className="form-control" id="exampleInputEmail1"
                                   aria-describedby="emailHelp" required value={since} onChange={text => setSince(text.target.value)} />
                                <small id="emailHelp" className="form-text text-muted">Fecha desde, obligatorio.</small>
                        </div>
                        <div className="form-group col-lg-5 col-md-5 col-ms-12">
                            <label htmlFor="exampleInputEmail1">Fecha hasta</label>
                            <input type="date" className="form-control" id="exampleInputEmail1"
                                   aria-describedby="emailHelp" required value={until} onChange={text => setUntil(text.target.value)} />
                                <small id="emailHelp" className="form-text text-muted">Fecha hasta, obligatorio.</small>
                        </div>
                        <button type="submit" className="btn btn-light col-lg-2 col-md-2 col-ms-12">
                            Consultar <span className="fa fa-search ml-2" />
                        </button>
                    </form>
                    <br/>
                    {
                        loading && <Fragment>
                            <Loading />
                            <br/>
                        </Fragment>
                    }
                    {
                        menu === 1 && (
                            <div className="table-responsive">
                                <h2>Parqueadero más usado</h2>
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Parqueadero</th>
                                        <th>Usos (cantidad)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        reports.length > 0 ? reports.map((x, index) => (
                                            <tr>
                                                <td>{index+1}</td>
                                                <td>{x.type}</td>
                                                <td>{x.cant}</td>
                                            </tr>
                                        )) : <tr><td colSpan="3">Sin resultado</td></tr>
                                    }
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                    {
                        menu === 2 && (
                            <div className="table-responsive">
                                <h2>Transacciones de entrada y salida</h2>
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Cliente</th>
                                        <th>Vehiculo</th>
                                        <th>Estado</th>
                                        <th>Fecha Ingreso</th>
                                        <th>Fecha Salida</th>
                                        <th>Tiempo (Minutos)</th>
                                        <th>Total</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        reports.length > 0 ? reports.map((x, index) => (
                                            <tr>
                                                <td>{x.id}</td>
                                                <td>{x.name} - {x.number}</td>
                                                <td>{x.code}</td>
                                                <td>{x.state === 0 ? 'En parqueadero' : 'Completado'}</td>
                                                <td>{x.date_start}</td>
                                                <td>{x.date_end}</td>
                                                <td>{x.time}/m</td>
                                                <td>${x.total}</td>
                                            </tr>
                                        )) : <tr><td colSpan="8">Sin resultado</td></tr>
                                    }
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                    {
                        menu === 3 && (
                            <div className="table-responsive">
                                <h2>Cantidad de vehículos por tipos que han ingresado</h2>
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tipo Vehiculo</th>
                                        <th>Ingresos (cantidad)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        reports.length > 0 ? reports.map((x, index) => (
                                            <tr>
                                                <td>{index+1}</td>
                                                <td>{x.type}</td>
                                                <td>{x.cant}</td>
                                            </tr>
                                        )) : <tr><td colSpan="3">Sin resultado</td></tr>
                                    }
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                    {
                        menu === 4 && (
                            <div className="table-responsive">
                                <h2>Monto obtenido por día
                                {
                                    reports.length > 0 ? ' $'+reports[0].total : 'Sin resultado'
                                }
                                </h2>
                            </div>
                        )
                    }
                </div>
            </div>

        </div>
    );
}

export default Reports;
