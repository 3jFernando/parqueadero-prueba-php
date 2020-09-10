import React, {Component} from 'react';

class Loading extends Component {
    render() {
        return(
            <div className="card">
                <div className="card-body text-center">
                    <span className="fa fa-refresh mr-2" />
                    <b>Cargando, espera</b>
                </div>
            </div>
        );
    }
}

export default Loading;
