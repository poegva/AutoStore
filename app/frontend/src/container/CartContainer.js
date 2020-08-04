import React from "react";
import {connect} from "react-redux";
import {setOpened} from "../actions/OrderActions";
import Cart from "../components/Cart";

function CartContainer(props) {
    const cartEmpty = Object.keys(props.cart.content).length === 0

    if (!cartEmpty) {
        return <Cart cart={props.cart} order={props.order} setOpened={props.setOpened} />;
    }
    return null;
}

const mapStateToProps = store => {
    return {
        cart: store.cart,
        order: store.order,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setOpened: opened => dispatch(setOpened(opened))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartContainer);