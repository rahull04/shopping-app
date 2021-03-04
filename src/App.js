import './App.css';
import React from "react";
import Home from './screens/home/home';
import Men from './screens/men/men';
import Women from './screens/women/women';
import Cart from './screens/cart/cart';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Link
} from "react-router-dom";


class App extends React.Component {
  
  render(){
    return (
      <div className="App">
        <Router>
          <Switch>
                <Route exact path="/catalog/men">
                  <Men name='Men' />
                </Route>
                <Route exact path="/catalog/women">
                  <Women name='Women' />
                </Route>
                <Route exact path='/cart' >
                  <Cart />
                </Route>
                <Route exact path='/' >
                  <Home />
                </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
