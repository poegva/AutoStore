import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import {connect} from "react-redux";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseIcon from '@material-ui/icons/Close';
import CartContent from "./CartContent";
import ContactForm from "./ContactForm";
import DeliveryForm from "./DeliveryForm";
import ItemsLoading from "../components/ItemsLoading";

function CartDialog(props) {
    const theme = useTheme();
    const matches = !useMediaQuery(theme.breakpoints.down('sm'));

    if (props.cartCount === 0) {
        props.setCartOpen(false);
        return null;
    }

    let dialogContent = null;

    if (props.orderStep === 0) {
        dialogContent = (
            <Grid container  >
                <Grid item sm={12} md={6} style={{width: "100%"}} >
                    <ContactForm />
                </Grid>
                <Grid item sm={12} md={6} style={{width: "100%"}} >
                    <CartContent />
                </Grid>
            </Grid>
        );
    } else if (props.orderStep === 1) {
        dialogContent = (
            <Grid container  >
                <Grid item sm={12} md={6} style={{width: "100%"}} >
                    <DeliveryForm />
                </Grid>
                <Grid item sm={12} md={6} style={{width: "100%"}} >
                    <CartContent />
                </Grid>
            </Grid>
        );
    } else {
        dialogContent = (
            <ItemsLoading loadingText="Создание заказа..." style={{paddingTop: 40, paddingBottom: 40}} />
        );
    }

    if (!matches) {
        dialogContent = (
            <Box display="flex" flexDirection="column">
                <Box display="flex" justifyContent="flex-end">
                    <CloseIcon
                        style={{alignSelf: "end", paddingTop: 20, paddingRight: 20, fontSize: 60}}
                        onClick={() => {
                            props.setCartOpen(false)
                        }}
                    />
                </Box>

                {dialogContent}
            </Box>
        )
    }

    return (
        <Dialog
            onClose={() => {
                props.setCartOpen(false)
            }}
            aria-labelledby="Корзина"
            open={props.cartOpen}
            maxWidth="md"
            fullWidth
            fullScreen={!matches}
        >
            {dialogContent}
        </Dialog>
    );
}

const mapStateToProps = store => {
    return {
        orderStep: store.order.step,
        cartCount: Object.keys(store.order.cart).length
    };
}

const mapDispatchToProps = dispatch => {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartDialog);
