import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Button from "react-bootstrap/Button";

import {addItemToCart} from "./Cart";

class ItemCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item
        };
    }

    render() {
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Body>
               <Card.Title>{this.state.item.name}</Card.Title>
                <Card.Text>
                    {this.state.item.description}
                </Card.Text>
                <Button variant="primary" onClick={() => addItemToCart(this.state.item)}>{this.state.item.price}</Button>
              </Card.Body>
            </Card>
        )
    }
}

class Items extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        fetch("api/items/")
            .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            isLoaded: true,
                            items: result
                        });
                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div></div>;
        } else {
            return (
                <Container>
                    <CardGroup>
                        {items.map(item => <ItemCard key={item.id} item={item} />)}
                    </CardGroup>
                </Container>
            );
        }
    }
}

export {Items}