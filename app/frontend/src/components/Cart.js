import React from "react";
import Fab from "@material-ui/core/Fab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CloseIcon from '@material-ui/icons/Close';
import CartItemList from "./CartList";
import ContactForm from "./ContactForm";

const useStyles = makeStyles((theme) => ({
    openCartButton: {
        alignSelf: 'end',
        position: "fixed",
        top: '130px',
        right: '30px',
    },
    itemCard: {
        marginTop: theme.spacing(3),
        display: 'flex',
        justifyContent: 'flex-start'
    },
}));

function CartDialog(props) {
    const classes = useStyles();

    return (
        <Dialog
            onClose={props.handleClose}
            aria-labelledby="simple-dialog-title"
            open={props.order.opened}
            maxWidth="md"
            fullWidth
        >
            <Grid container spacing={0} >
                <Grid item sm={12} md={6} className={classes.itemCard}>
                    <CartItemList cart={props.cart}/>
                </Grid>
                <Grid item sm={12} md={6} className={classes.itemCard}>
                    <ContactForm />
                </Grid>
            </Grid>
        </Dialog>
    );
}

function OpenCartButton(props) {
    const classes = useStyles();

    return (
        <div className={classes.openCartButton}>
            <Fab color="primary" aria-label="add" onClick={() => props.setOpened(true)}>
                <AddIcon />
            </Fab>
        </div>
    );
}

export default function Cart(props) {
    return (
        <div>
            <OpenCartButton setOpened={props.setOpened} />
            <CartDialog handleClose={() => props.setOpened(false)} order={props.order} cart={props.cart}/>
        </div>
    )
}