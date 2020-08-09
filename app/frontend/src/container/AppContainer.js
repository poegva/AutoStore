import React from "react";
import {connect} from "react-redux";
import App from "../components/App";

const mapStateToProps = store => {
    return {
        lastOrderId: store.order.lastOrderId
    };
}

const mapDispatchToProps = dispatch => {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);