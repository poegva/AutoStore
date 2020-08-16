import React from "react";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from "@material-ui/core/Badge";
import {connect} from "react-redux";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Fab from "@material-ui/core/Fab";

function CartButton(props) {
    const theme = useTheme();
    const matches = !useMediaQuery(theme.breakpoints.down('sm'));

    if (props.cartCount === 0) {
        return null;
    }

    const content = (
        <Badge badgeContent={props.cartCount} color="secondary" onClick={() => {props.setCartOpen(true)}}>
            <ShoppingCartIcon style={{color: "black"}} />
        </Badge>
    )

    if (props.floating) {
        if (matches) {
            return (
                <Fab
                    style={{position: "fixed", alignSelf: "end", right: 30, top: 130, backgroundColor: "white"}}
                    onClick={() => props.setCartOpen(true)}
                >
                    {content}
                </Fab>
            );
        } else {
            return null;
        }
    } else {
        return content;
    }
}

const mapStateToProps = store => {
    return {
        cartCount: Object.values(store.order.cart).reduce((acc, current) => acc + current.quantity, 0)
    };
}

const mapDispatchToProps = dispatch => {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartButton);
