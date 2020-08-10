import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Container from "@material-ui/core/Container";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    dialogContainer: {
        paddingBottom: theme.spacing(4)
    },
    dialogGrid: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(8),
    },
    itemCard: {
        marginTop: theme.spacing(3),
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

function CartItemCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.itemCard}>
            <CardMedia
                className={classes.itemImage}
                image={props.item.image}
                title={props.item.name}
            />
            <CardContent className={classes.itemContent}>
                <Typography component="h6" variant="h6">
                    {props.item.name}
                </Typography>
                <div className={classes.quantityFlex}>
                    <RemoveIcon />
                    <Typography component="h6" variant="h6">
                        {props.quantity}
                    </Typography>
                    <AddIcon />
                </div>
            </CardContent>
            <CloseIcon />
        </Card>
    )
}

export default function CartList(props) {
    const classes = useStyles();

    return (
        <Container className={classes.dialogContainer}>
            <Typography component="h5" variant="h5" align="center">
                Корзина
            </Typography>
            {Object.values(props.cart).map(cartItem => (
                <CartItemCard item={cartItem.item} quantity={cartItem.quantity} key={cartItem.item.id} />
            ))}
        </Container>
    );
}