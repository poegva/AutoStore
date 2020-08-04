import React from "react";
import {Shop} from "../components/Shop";
import {addItem} from "../actions/CartActions";
import { connect } from "react-redux";

function ShopContainer(props) {
    return <Shop addItem={props.addItem} />;
}

const mapStateToProps = store => {
    return {};
}

const mapDispatchToProps = dispatch => {
    return {
        addItem: item => dispatch(addItem(item))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShopContainer);