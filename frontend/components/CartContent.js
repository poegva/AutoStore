import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {connect} from "react-redux";
import CartItemCard from "./CartItemCard";
import Box from "@material-ui/core/Box";
import {addItem, deleteItem, removeItem} from "../redux/actions/OrderActions";
import DeliveryCard from "./DeliveryCard";

function CartContent(props) {
    return (
        <Container style={{paddingTop: 20, paddingBottom: 40}}>
            <Typography component="h5" variant="h5" align="center" style={{paddingBottom: 30}}>
                Корзина
            </Typography>
            <Box display="flex" flexDirection="column" justifyContent="center">
                {Object.values(props.cart).map(cartItem => (
                    <CartItemCard
                        item={cartItem.item}
                        quantity={cartItem.quantity}
                        key={cartItem.item.id}
                        cart
                        addItem={() => props.addItem(cartItem.item)}
                        removeItem={() => props.removeItem(cartItem.item)}
                        deleteItem={() => props.deleteItem(cartItem.item)}
                    />
                ))}
                <DeliveryCard option={props.deliveryOption} />
                <Box style={{padding: 16}}>
                    <Typography align="right">
                        Итого: {props.cartTotal + (props.deliveryOption ? props.deliveryOption.option.cost : 0)} ₽
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

const mapStateToProps = store => {
    return {
        cart: store.order.cart,
        cartTotal: store.order.cartTotal,
        deliveryOption: store.order.deliveryOption,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addItem: (item) => dispatch(addItem(item)),
        removeItem: (item) => dispatch(removeItem(item)),
        deleteItem: (item) => dispatch(deleteItem(item)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartContent);