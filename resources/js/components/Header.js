import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Header extends Component {

    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="/">Parqueadero</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-link" to="/clients">Clientes</Link>
                        <Link className="nav-link" to="/reports">Reportes</Link>
                        <Link className="nav-link" to="/settings">Configuraciones</Link>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header;
