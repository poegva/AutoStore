import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

export default function Order(props) {

    let content = null;

    if (props.order.id && props.order.token) {
        content = <Typography align="center">Загрузка заказа</Typography>
    } else {
        content = <Typography align="center">Не найдено заказов</Typography>
    }

    return (
        <Box height="100%">
            {content}
        </Box>
    );
}