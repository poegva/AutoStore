import React from "react";
import { useHistory } from "react-router-dom";

import {clearCart, getCart} from "./Cart";

function OrderSubmit(props) {
    let history = useHistory();
    let submitOrder = props.submitOrder;

    function handleClick(event) {
        submitOrder();
        history.push("/home");
    }

    return (
        <Button variant="primary" type="submit" onClick={handleClick}>
            Оформить заказ
        </Button>
    );
}

export class OrderForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    submitOrder() {
        console.log("Oppa");

        const data = this.state;
        data.cart = getCart();

        console.log(data);

        const body = JSON.stringify(data);

        fetch("api/orders/", {
            method: 'post',
            body: body,
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(
                (result) => {
                    return {
                        'status': 'OK',
                        'error': null
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    return {
                        'status': 'ERROR',
                        'error': error
                    }
                }
            )

    }

    render() {
        return (
            <p>ddi</p>
            /*<Form>
                <Form.Group>
                    <Form.Label>Ваше имя</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Иван Иванов"
                        onChange={this.handleInputChange}
                        name="name"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        placeholder="ivan@ivanov.ru"
                        onChange={this.handleInputChange}
                        name="email"
                    />
                </Form.Group>

                <OrderSubmit
                    submitOrder={() => this.submitOrder()}
                />
            </Form>*/
        )
    }
}