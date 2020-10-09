import React from "react";
import AppMenu from "./AppMenu";
import FooterBlock from "./blocks/FooterBlock";

export default function Layout(props) {
    const [cartOpen, setCartOpen] = React.useState(false);

    let sections = [
        {
            title: 'Главная',
            url: '/'
        },
        {
            title: 'Магазин',
            url: '/shop'
        },
        {
            title: 'Мой заказ',
            url: '/order'
        }
    ];

    return (
        <div>
            <AppMenu
                sections={sections}
                image=""
                setCartOpen={setCartOpen}
            />
            {props.children.map(child => child(cartOpen))}
            <FooterBlock />
        </div>
    )
}