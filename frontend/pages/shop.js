import React from "react";
import {addItem} from "../redux/actions/OrderActions";
import {connect} from "react-redux";

import Container from "@material-ui/core/Container";

import TextBlock from "../components/blocks/TextBlock";
import ShopItemGrid from "../components/ShopItemGrid";
import ItemsLoading from "../components/ItemsLoading";
import CartButton from "../components/CartButton";
import CartDialog from "../components/CartDialog";
import {setCartOpen} from "../redux/actions/GeneralActions";
import Head from "next/head";

function Shop(props) {
    const [items, setItems] = React.useState(props.items);
    const [error, setError] = React.useState(false);

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
            <Head>
                <title>HQD - Магазин</title>
                <meta name="title" content="HQD - Магазин" key="title" />
                <meta name="description" content="HQD Cuvie - это сочетание удобства, стиля и невероятного вкуса в одном продукте.
Это именно та электронная сигарета, которую все так долго ждали - миниатюрная, простая в использовании, надежная и яркая!
Несмотря на свой размер, в HQD Cuvie 300 затяжек, что равнозначно 1-2 дням свободному и полноценному парению.
HQD Cuvie - одна из самых разнообразных электронных сигарет. Она насчитываю до 26 - от кока-колы - до фруктового микса. Любой сможет выбрать свой любимый вкус.
Уже в наличии!" key="description" />
            </Head>
            <TextBlock title="HQD Cuvie" subtitle="Успей попробовать все вкусы!" />
            {items  ?
                <ShopItemGrid cart={props.cart} items={items ?? props.items} addItem={props.addItem} /> :
                <ItemsLoading error={error} errorText="Что-то пошло не так" loadingText="Загрузка..." />
            }
        </Container>
    );
}

export async function getStaticProps() {
    const res = await fetch(process.env.HOST + '/api/items/')
    const items = await res.json()

    return {
        props: {
            items
        },
        revalidate: 10
    }
}

const mapStateToProps = store => {
    return {
        cart: store.order.cart,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addItem: item => dispatch(addItem(item)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Shop);