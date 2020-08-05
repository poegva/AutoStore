import React from "react";
import {connect} from "react-redux";
import ContactForm from "../components/ContactForm";
import {setEmail, setName, setPhone, submitContacts} from "../actions/OrderActions";

const mapStateToProps = store => {
    return {
        order: store.order,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setName: (name) => dispatch(setName(name)),
        setEmail: (email) => dispatch(setEmail(email)),
        setPhone: (phone) => dispatch(setPhone(phone)),
        submitContacts: () => dispatch(submitContacts()),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContactForm);