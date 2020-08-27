import {
    returnToContacts,
    setAddress,
    setDeliveryOption,
    submitOrder
} from "../redux/actions/OrderActions";
import {connect} from "react-redux";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import GenericForm from "../components/form/GenericForm";
import React from "react";
import AddressField from "../components/form/AddressField";
import DeliveryOptionField from "../components/form/DeliveryOptionField";
import {useHistory} from "react-router-dom";

function DeliveryForm(props) {
    let history = useHistory();

    function convertItemToData(item) {
        return {
            item: item.item.id,
            quantity: item.quantity,
        };
    }

    function submitOrder() {
        console.log(props.order.deliveryOption);
        const orderData = {
            name: props.order.contacts.name,
            email: props.order.contacts.email,
            phone: props.order.contacts.phone,
            address: props.order.address,
            delivery_option: props.order.deliveryOption.type,
            delivery_tariff: props.order.deliveryOption.option.tariff,
            delivery_partner: props.order.deliveryOption.option.partner,
            items: Object.values(props.order.cart).map(item => convertItemToData(item))
        };

        props.submitOrder(orderData, () => history.push('/order'));
    }

    console.log(props.order);

    return (
        <Container style={{paddingTop: 20, paddingBottom: 20}}>
            <Typography component="h5" variant="h5" align="center" style={{paddingBottom: 40}}>
                Данные доставки
            </Typography>
            <GenericForm submit={submitOrder} returnBack={props.returnToContacts} submitText="Купить">
                <AddressField
                    id="address"
                    label="Адрес"
                    value={props.order.address}
                    setValue={props.setAddress}
                    validate={(value) => value.hasHouse}
                    validationText="Введите полный адрес"
                    required
                />
                <DeliveryOptionField
                    id="options"
                    label="Способ доставки"
                    address={props.order.address}
                    value={props.order.deliveryOption}
                    setValue={props.setDeliveryOption}
                    itemsValue={props.order.cartTotal ?? 0}
                    options={[
                        {type: "COURIER", name: "Курьер"},
                        {type: "POST", name: "Почта"},
                    ]}
                    required
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
        returnToContacts: () => dispatch(returnToContacts()),
        setAddress: (address) => dispatch(setAddress(address)),
        setDeliveryOption: (selected) => dispatch(setDeliveryOption(selected)),
        submitOrder: (orderData, redirect) => dispatch(submitOrder(orderData, redirect)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeliveryForm);