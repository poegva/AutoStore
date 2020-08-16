import React from 'react';
import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom";
import AppMenu from "../components/AppMenu";
import Shop from "./Shop";
import Container from "@material-ui/core/Container";
import CartDialog from "./CartDialog";
import CartButton from "./CartButton";
import {connect} from "react-redux";
import Order from "./Order";

function App(props) {
    const [cartOpen, setCartOpen] = React.useState(false);

    let sections = [
        {
            title: 'Главная',
            url: '/',
            component: <p>Главная</p>
        },
        {
            title: 'Магазин',
            url: '/shop',
            component: <Shop />
        },
    ];

    if (props.lastOrderId) {
        sections = [
            ...sections,
            {
                title: 'Мой заказ',
                url: '/order',
                component: <Order />
            }
        ]
    }

    return (
        <BrowserRouter>
            <AppMenu
                sections={sections}
                image={`http://${window.location.hostname}/static/logo.png`}
                setCartOpen={setCartOpen}
            />
            <CartButton setCartOpen={setCartOpen} floating />
            <CartDialog cartOpen={cartOpen} setCartOpen={setCartOpen} />
            <Container disableGutters style={{backgroundColor: "#f6f6f6"}} >
                <Switch>
                    {sections.map(value => (
                        <Route strict exact path={value.url} key={value.url}>
                            {value.component}
                        </Route>
                    ))}
                </Switch>
            </Container>
        </BrowserRouter>
  )
}

const mapStateToProps = store => {
    return {
        lastOrderId: store.order.lastOrderId
    };
}

const mapDispatchToProps = dispatch => {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
