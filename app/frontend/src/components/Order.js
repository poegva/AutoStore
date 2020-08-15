import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorIcon from '@material-ui/icons/Error';

function OrderLoading(props) {
    return (
        <Box display="flex" flexDirection="column">
            <CircularProgress style={{ alignSelf: "center" }}/>
            <Typography align="center" component="h5" variant="h5">Загрузка заказа</Typography>
        </Box>
    );
}

function OrderError(props) {
    return (
        <Box display="flex" flexDirection="column">
            <ErrorIcon color="secondary" fontSize="large" style={{ alignSelf: "center" }}/>
            <Typography align="center" component="h5" variant="h5">Заказ не найден</Typography>
        </Box>
    );
}

function DisplayOrder(props) {
    return (
        <p>Заказ</p>
    )
}

export default function Order(props) {
    const [order, setOrder] = React.useState(null);
    const [error, setError] = React.useState(!props.order.id || !props.order.token);

    let content = null;
    if (error) {
        content = <OrderError />;
    } else {
        if (order) {
            content = <DisplayOrder order={order} />;
        } else {
            content = <OrderLoading />;
        }
    }

    return (
        <Box height="100%" display="flex" flexDirection="column" justifyContent="space-around">
            {content}
        </Box>
    );
}