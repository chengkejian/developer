/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Example from './example';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';


const Routes = () => (
  <Router>
    <Route exact path="/login" render={() => <Login />} />
    <Route exact path="/register" render={() => <Register />} />
    <Route exact path="/" render={() => <Example />} />
    <Route exact path="/dingtalk" render={() => <Example />} />
    <Route path="/i" render={() => <Home />} />
  </Router>
);

export default Routes;
