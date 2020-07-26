import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import {Shop} from './Shop';
import {Items} from './Items';
import {Cart, cartNotEmpty} from './Cart';
import {OrderForm} from './OrderForm';

import {Navbar, Nav, Button} from "react-bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Order} from "./Order";

function App() {
    return (
        <Router>
            <Navbar bg="light" expand="lg">
                <Container>
                <Navbar.Brand>HQD Russia</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Link to='/' className='nav-link'>Главная</Link>
                        <Link to='/items' className='nav-link'>Магазин</Link>
                         <Link to='/cart' className='nav-link'>Корзина</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>

            <Switch>
                <Route path="/items"> <Items /> </Route>
                <Route path="/cart">
                    <Container>
                        <Row>
                            <Col><OrderForm /></Col>
                            <Col><Cart /></Col>
                        </Row>
                    </Container>
                </Route>
                <Route path="/order/:id"><Order /></Route>
                <Route path="/"> <Shop /> </Route>
            </Switch>
        </Router>
    )
}

export default App;