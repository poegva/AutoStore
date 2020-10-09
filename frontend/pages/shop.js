import React from "react";
import {addItem} from "../redux/actions/OrderActions";
import {connect} from "react-redux";

import Container from "@material-ui/core/Container";

import TextBlock from "../components/blocks/TextBlock";
import ShopItemGrid from "../components/ShopItemGrid";
import ItemsLoading from "../components/ItemsLoading";
import CartButton from "../components/CartButton";
import CartDialog from "../components/CartDialog";

function Shop(props) {
    const [items, setItems] = React.useState(null);
    const [error, setError] = React.useState(false);
    const [cartOpen, setCartOpen] = React.useState(false);

    React.useEffect(() => {
        if (!items) {
            fetch("/api/items/")
                .then(res => res.json())
                .then(
                    (result) => setItems(result),
                    (error) => setError(true)
                )
        }
    }, [items]);

    return (
        <Container style={{paddingTop: 20}} >
            <CartButton setCartOpen={setCartOpen} floating />
            <CartDialog cartOpen={cartOpen} setCartOpen={setCartOpen} />
            <TextBlock title="HQD Cuvie" subtitle="Успей попробовать все вкусы!" />
            {items ?
                <ShopItemGrid cart={props.cart} items={items} addItem={props.addItem} /> :
                <ItemsLoading error={error} errorText="Что-то пошло не так" loadingText="Загрузка..." />
            }
        </Container>
    );
}

const mapStateToProps = store => {
    return {
        cart: store.order.cart
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addItem: item => dispatch(addItem(item))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Shop);