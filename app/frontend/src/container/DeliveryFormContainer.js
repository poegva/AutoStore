import React from "react";
import {connect} from "react-redux";
import DeliveryForm from "../components/DeliveryForm";
import {returnToContacts, setName} from "../actions/OrderActions";

const mapStateToProps = store => {
    return {
        order: store.order,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        returnToContacts: () => dispatch(returnToContacts()),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeliveryForm);