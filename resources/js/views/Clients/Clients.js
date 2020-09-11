import React, {useState, useEffect, Fragment} from 'react';

// componentes
import History from "./History";
import New from "./New";

const Clients = props => {

    const [active, setActive] = useState(1);

    return (
        <Fragment>
            <ul className="nav nav-pills">
                <li className="nav-item">
                    <span className={active === 1 ? "nav-link active" : "nav-link"} onClick={() => setActive(1)}>Nuevo cliente</span>
                </li>
                <li className="nav-item">
                    <span className={active === 2 ? "nav-link active" : "nav-link"} onClick={() => setActive(2)}>Historico de clientes</span>
                </li>
            </ul>

            <br/>
            <div className="card">
                <div className="card-body">
                    <h2>{active === 1 ? 'Nuevo cliente' : 'Listado de cientes'}</h2>
                </div>
            </div>
            <br/>
            <div>
                {
                    active === 1 ?
                        <New/>
                        :
                        <History/>
                }

            </div>

        </Fragment>
    );
};

export default Clients;
