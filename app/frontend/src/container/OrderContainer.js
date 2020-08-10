import React from "react";
import {addItem} from "../actions/OrderActions";
import { connect } from "react-redux";
import Order from "../components/Order";

const mapStateToProps = store => {
    return {
        order: store.order.lastOrder
    };
}

const mapDispatchToProps = dispatch => {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Order);