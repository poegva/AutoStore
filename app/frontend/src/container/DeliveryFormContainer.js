import React from "react";
import {connect} from "react-redux";
import DeliveryForm from "../components/DeliveryForm";
import {returnToContacts, setAddress, setDeliverySelected, setName, submitOrder} from "../actions/OrderActions";

const mapStateToProps = store => {
    return {
        order: store.order,
        cart: store.cart,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        returnToContacts: () => dispatch(returnToContacts()),
        setAddress: (address) => dispatch(setAddress(address)),
        setDeliverySelected: (selected) => dispatch(setDeliverySelected(selected)),
        submitOrder: (orderData) => dispatch(submitOrder(orderData)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeliveryForm);