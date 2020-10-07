import {connect} from "react-redux";
import Container from "@material-ui/core/Container";
import React from "react";
import ItemsLoading from "../components/ItemsLoading";
import TextBlock from "../components/layout/TextBlock";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CartItemCard from "../components/CartItemCard";
import {loadOrder} from "../redux/actions/OrderActions";
import DeliveryCard from "../components/DeliveryCard";

function PaymentWidget(props) {
    const [display, setDisplay] = React.useState(true);

    console.log("Rendering payment widget");

    React.useEffect(() => {
        if (!display)
            return;

        setDisplay(false);

        const script = document.createElement("script");
        script.src = "https://kassa.yandex.ru/checkout-ui/v2.js";
        script.async = true;
        script.onload = () => {
            const checkout = new window.YandexCheckout({
                confirmation_token: props.token,
                return_url: window.location.href,
                embedded_3ds: true,
                error_callback(error) {
                    console.log(error);
                    if (error.error === 'token_expired') {
                        props.expiredCallback();
                    }
                }
            });

            checkout.render('payment-form');
        }
        document.body.appendChild(script);

        return () => document.body.removeChild(script);
    }, [display, props]);

    return (
        <React.Fragment>
            {props.reason ? <ItemsLoading error errorText="Ошибка оплаты, попробуйте еще раз" style={{paddingBottom: 20}} /> : null}
            <div id="payment-form" style={{minHeight: 400}}></div>
        </React.Fragment>
    );
}

function Payment(props) {
    const [loading, setLoading] = React.useState(false);

    if (props.order.status !== 'WAITING_PAYMENT')
        return null;

    function updateOrder() {
        setLoading(true);
        props.loadOrder(props.order.id, props.order.token, () => setLoading(false));
    }

    return (
        <Box style={{paddingBottom: 20}}>
            <Typography variant="h5" component="h5" align="center" paragraph>Оплата</Typography>
            {loading ?
                <ItemsLoading variant="h6" loadingText="Обработка оплаты..." /> :
                <PaymentWidget
                    token={props.order.payment.token}
                    expiredCallback={updateOrder}
                    reason={props.order.payment.cancellation_reason}
                />
            }
        </Box>
    )
}

function OrderDetails(props) {
    return (
        <Box style={{paddingBottom: 20}}>
            <Typography variant="h5" component="h5" align="center" paragraph>Детали</Typography>
            <Typography align="center">Имя: {props.order.name}</Typography>
            <Typography align="center">Телефон: {props.order.phone}</Typography>
            <Typography align="center">Email: {props.order.email}</Typography>
            <Typography align="center">Адрес: {props.order.address}</Typography>
        </Box>
    )
}

function OrderContent(props) {
    return (
        <Box style={{paddingBottom: 20}} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Typography variant="h5" component="h5" align="center" paragraph>Содержимое</Typography>
            <Box display="flex" flexDirection="column" justifyContent="center" style={{width: 500, maxWidth: "100%"}}>
                {props.order.items.map(item => (
                    <CartItemCard quantity={item.quantity} item={item.item} key={item.item.id} />
                ))}
                <DeliveryCard option={{option: {cost: props.order.delivery_cost}}} />
                <Box style={{padding: 16}}>
                    <Typography align="right">
                        Итого: {props.order.items_cost + props.order.delivery_cost} ₽
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

function OrderInfo(props) {
    const stateToText = {
        WAITING_PAYMENT: 'Ожидание оплаты',
        PAYED: 'Оплачен',
        DELIVERY: 'В процессе доставки',
        COMPLETED: 'Выполнен',
        CANCELED: 'Отменен'
    }

    return (
        <Box>
            <Typography align="center" paragraph>Статус: {stateToText[props.order.status]}</Typography>
            <Payment order={props.order} loadOrder={props.loadOrder} />
            <OrderDetails order={props.order} />
            <OrderContent order={props.order} />
        </Box>
    )
}

function Order(props) {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    let token = urlParams.get('token');

    if (!id) {
        id = props.order.lastOrderId;
    }
    const order = props.order.orders[id];

    const [error, setError] = React.useState(id ? false : "Заказ не найден");
    const [reloaded, setReloaded] = React.useState(false);

    React.useEffect(() => {
        if (!error && !id) {
            setError("Ошибка загрузки");
        } else {
            if (!error) {
                if (!order) {
                    setError( "Заказ не найден");
                } else {
                    if (!reloaded) {
                        props.loadOrder(id, token ?? order.token);
                        setReloaded(true);
                    }
                }
            }
        }
    }, [order, props, reloaded, error, id]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (order) {
                props.loadOrder(id, order.token);
            }
        }, 30000);
        return () => clearInterval(interval);
    });

    let content = null;

    if (error) {
        content = <ItemsLoading error errorText={error} />;
    } else {
        let subContent = null;

        if (!order) {
            subContent = <ItemsLoading />;
        } else {
            subContent = <OrderInfo loadOrder={props.loadOrder} order={props.order.orders[id]} />;
        }

        content = (
            <React.Fragment>
                <TextBlock subtitle={"Заказ №" + id} />
                {subContent}
            </React.Fragment>
        );
    }

    return (
        <Container style={{paddingTop: 20}}>
            {content}
        </Container>
    );
}

const mapStateToProps = store => {
    return {
        order: store.order
    };
}

const mapDispatchToProps = dispatch => {
    return {
        loadOrder: (id, token, callback) => dispatch(loadOrder(id, token, callback))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Order);