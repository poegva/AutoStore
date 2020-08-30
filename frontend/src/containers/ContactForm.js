import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {connect} from "react-redux";
import {setEmail, setName, setPhone, submitContacts} from "../redux/actions/OrderActions";
import PhoneField from "../components/form/PhoneField";
import GenericForm from "../components/form/GenericForm";
import BasicField from "../components/form/BasicField";

function ContactForm(props) {

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    return (
        <Container style={{paddingTop: 20, paddingBottom: 20}}>
            <Typography component="h5" variant="h5" align="center" style={{paddingBottom: 40}}>
                Оформить заказ
            </Typography>
            <GenericForm submit={props.submitContacts}>
                <BasicField
                    id="name"
                    label="Имя, Фамилия"
                    value={props.order.contacts.name}
                    setValue={props.setName}
                    required
                    validate={(value) => value.split(' ').length === 2}
                    validationText="Введите имя и фамилию"
                />
                <PhoneField
                    id="phone"
                    label="Телефон"
                    value={props.order.contacts.phone}
                    setValue={props.setPhone}
                    required
                    validate={(value) => value.replace(/\D/g, '').length === 11}
                />
                <BasicField
                    id="email"
                    label="Email"
                    value={props.order.contacts.email}
                    setValue={props.setEmail}
                    required
                    validate={(value) => validateEmail(value)}
                />
            </GenericForm>
        </Container>
    );
}

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