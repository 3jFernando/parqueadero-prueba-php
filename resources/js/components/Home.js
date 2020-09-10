import React, {Fragment, useState, useEffect} from 'react';

// servicios
import {AxiosPOST, AxiosGET} from '../services/Axios';

// componentes
import Loading from './Loading';

const Settings = props => {
    const [loading, setloading] = useState(false);
    const [typeVechicles, setTypeVechicles] = useState([]);

    useEffect(() => {
        setloading(true);
        AxiosGET('settings/vehicles', callbackLoadTypeVehicles);
    }, []);

    // cargar vahiculos
    const callbackLoadTypeVehicles = (status, response) => {
        if(status === 200) setTypeVechicles(response.types);

        if(status === 1000) setloading(false);
    };

    return(
        <Fragment>

            <div className="card card-body">
                <h2>Parqueadero</h2>
            </div>

            <br/>



        </Fragment>
    );
};



export default Settings;
