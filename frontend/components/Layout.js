import React from "react";
import AppMenu from "./AppMenu";
import FooterBlock from "./blocks/FooterBlock";
import {useSelector} from "react-redux";

export default function Layout(props) {
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
            {props.children}
            <FooterBlock />
        </div>
    )
}