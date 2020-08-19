import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React from "react";

export default function DeliveryCard(props) {
    if (!props.option) {
        return null;
    }

    return (
        <Card style={{marginTop: 8, marginBottom: 4}}>
            <CardContent style={{padding: 16}}>
                <Box display="flex" justifyContent="space-between">
                    <Typography>Доставка {props.option.name ? "(" + props.option.name + ")" : ""}</Typography>
                    <Typography>{props.option.option.cost} ₽</Typography>
                </Box>
            </CardContent>
        </Card>
    )
}