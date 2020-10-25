import React from "react";
import AppMenu from "./AppMenu";
import FooterBlock from "./blocks/FooterBlock";
import {connect, useSelector} from "react-redux";
import CartButton from "./CartButton";
import CartDialog from "./CartDialog";
import {setCartOpen} from "../redux/actions/GeneralActions";

function Layout(props) {
    const hasOrder = useSelector(store => store.order.lastOrderId);

    let sections = [
        {
            title: 'Главная',
            url: '/'
        },
        {
            title: 'Магазин',
            url: '/shop'
        }
    ];

    if (hasOrder) {
        sections.push({
            title: 'Мой заказ',
            url: '/order'
        });
    }

    return (
        <div>
            <AppMenu
                sections={sections}
                image=""
            />
            <CartButton setCartOpen={props.setCartOpen} floating />
            <CartDialog cartOpen={props.cartOpen} setCartOpen={props.setCartOpen} />
            <div style={{marginTop: "4rem"}}>
                {props.children}
            </div>
            <FooterBlock />
        </div>
    )
}

const mapStateToProps = store => {
    return {
        cartOpen: store.general.cartOpen
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setCartOpen: open => dispatch(setCartOpen(open))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Layout);