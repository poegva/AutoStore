import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Box from "@material-ui/core/Box";
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    itemCard: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        display: 'flex',
        justifyContent: 'flex-start'
    },
    itemContent: {
        width: '100%',
    },
    itemImage: {
        width: '100px',
    },
    quantityFlex: {
        display: 'flex'
    },
}));

function ItemQuantity(props) {
    if (props.cart) {
        return (
            <Box display="flex">
                <IconButton size="small" onClick={props.removeItem}>
                    <RemoveIcon />
                </IconButton>
                <Typography
                    component="h6"
                    variant="body1"
                    style={{paddingLeft: 7, paddingRight: 7, paddingTop: 5}}
                >
                    {props.quantity}
                </Typography>
                <IconButton size="small" onClick={props.addItem}>
                    <AddIcon />
                </IconButton>
            </Box>
        );
    } else {
        return (
            <Box display="flex">
                <Typography
                    component="h6"
                    variant="body1"
                    style={{paddingTop: 5}}
                >
                    Количество: {props.quantity}
                </Typography>
            </Box>
        )
    }
}

export default function CartItemCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.itemCard}>
            <CardMedia
                className={classes.itemImage}
                image={props.item.image}
                title={props.item.name}
            />
            <CardContent className={classes.itemContent} style={{padding: 16}}>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Typography component="h6" variant="h6">{props.item.name}</Typography>
                    {props.cart ? (
                    <IconButton size="small" onClick={props.deleteItem}>
                        <CloseIcon />
                    </IconButton>) : null}
                </Box>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <ItemQuantity
                        quantity={props.quantity}
                        cart={props.cart}
                        removeItem={props.removeItem}
                        addItem={props.addItem}
                    />
                    <Typography
                        component="h6"
                        variant="body1"
                        style={{paddingTop: 5}}
                        align="center"
                    >
                        {props.item.price * props.quantity}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
