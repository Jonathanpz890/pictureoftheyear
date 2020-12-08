import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Main from './main.js';
import Backpanel from './backpanel.js';

class App extends Component {
    render() {
        return(
            <Router>
                <Switch>
                    <Route path='/' component={Main}/>
                    <Route path='/backpanel'><Backpanel /></Route>
                </Switch>
            </Router>
        )
    }
}

export default App;

