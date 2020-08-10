import React from "react";
import {connect} from "react-redux";
import Cart from "../components/Cart";

function CartContainer(props) {
    if (!props.cartEmpty) {
        return <Cart orderStep={props.orderStep} />;
    }
    return null;
}

const mapStateToProps = store => {
    console.log(store.order);

    return {
        cartEmpty: Object.keys(store.order.cart).length === 0,
        orderStep: store.order.step,
    };
}

export default connect(mapStateToProps)(CartContainer);