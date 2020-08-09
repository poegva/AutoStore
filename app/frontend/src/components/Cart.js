import React from "react";
import Fab from "@material-ui/core/Fab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ContactForm from "../container/ContactFormContainer";
import CartList from "../container/CartListContainer";
import DeliveryForm from "../container/DeliveryFormContainer";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";

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
    redirectContainer: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
    }
}));

function CartDialog(props) {
    const classes = useStyles();

    let dialogContent = null;

    if (props.orderStep === 0) {
        dialogContent = (
            <Grid container spacing={0} >
                <Grid item sm={12} md={6} className={classes.itemCard}>
                    <ContactForm />
                </Grid>
                <Grid item sm={12} md={6} className={classes.itemCard}>
                    <CartList cart={props.cart}/>
                </Grid>
            </Grid>
        );
    } else if (props.orderStep === 1) {
        dialogContent = (
            <Grid container spacing={0} >
                <Grid item sm={12} md={6} className={classes.itemCard}>
                    <DeliveryForm />
                </Grid>
                <Grid item sm={12} md={6} className={classes.itemCard}>
                    <CartList cart={props.cart}/>
                </Grid>
            </Grid>
        );
    } else {
        dialogContent = (
            <Box display="flex" flexDirection="column" alignItems="center" className={classes.redirectContainer}>
                <CircularProgress />
                <Typography variant="h5" component="h5">Перенаправление на страницу оплаты</Typography>
            </Box>
        );
    }

    return (
        <Dialog
            onClose={props.handleClose}
            aria-labelledby="simple-dialog-title"
            open={props.opened}
            maxWidth="md"
            fullWidth
        >
            {dialogContent}
        </Dialog>
    );
}

function OpenCartButton(props) {
    const classes = useStyles();

    return (
        <div className={classes.openCartButton}>
            <Fab aria-label="add" onClick={() => props.setOpened(true)}>
                <ShoppingCartIcon />
            </Fab>
        </div>
    );
}

export default function Cart(props) {
    const [opened, setOpened] = React.useState(false);

    return (
        <div>
            <OpenCartButton setOpened={setOpened} />
            <CartDialog
                handleClose={() => setOpened(false)}
                orderStep={props.orderStep}
                opened={opened}/>
        </div>
    );
}