import store from 'store2'
import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function CartItem(props) {
    return (
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{props.item.name}</Card.Title>
              <Card.Text>Количество: {props.quantity}</Card.Text>
            <Card.Link href="#" onClick={props.onClick}>Remove</Card.Link>
          </Card.Body>
        </Card>
    )
}

export class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: getCart()
        };
    }

    renderItem(value) {
        return (
            <CartItem
                key={value.item.id}
                item={value.item}
                quantity={value.quantity}
                onClick={() => this.removeItem(value.item)}
            />
        )
    }

    removeItem(item) {
        this.setState({
            cart: removeItemFromCart(item)
        });
        console.log(this.state);
    }

    render() {
        return (
            <Container>
                {Object.entries(this.state.cart).map(([key, value]) => this.renderItem(value))}
            </Container>
        )
    }
}

function addItemToCart(item) {
    const currentCart = store.get('cart', {});

    if (item.id in currentCart) {
        currentCart[item.id]['quantity'] += 1;
    } else {
        currentCart[item.id] = {
            'item': item,
            'quantity': 1
        };
    }

    store.set('cart', currentCart);

    return currentCart;
}

function removeItemFromCart(item) {
    const currentCart = store.get('cart', {});

    if (item.id in currentCart) {
        delete currentCart[item.id];
    }

    store.set('cart', currentCart);

    return currentCart;
}

function getCart() {
    return store.get('cart', {});
}

function clearCart() {
    store.set('cart', {});
    return {};
}

export {addItemToCart, getCart, removeItemFromCart, clearCart}