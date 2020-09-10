import React, {Component, Fragment} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';

import Home from './components/Home';
import Header from './components/Header';
import Clients from './views/Clients/Clients';
import Reports from './views/Reports/Reports';
import Settings from './views/Settings/Settings';

class Index extends Component {
    render() {
        return (
            <BrowserRouter>
                <Header />
                <div className="container p-4">
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route path='/clients' component={Clients}/>
                        <Route path='/reports' component={Reports}/>
                        <Route path='/settings' component={Settings}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<Index/>, document.getElementById('index-body'));
