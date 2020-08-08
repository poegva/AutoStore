import React from "react";
import Fab from "@material-ui/core/Fab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ContactForm from "../container/ContactFormContainer";
import CartList from "../container/CartListContainer";
import DeliveryForm from "../container/DeliveryFormContainer";

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

export default class Cart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            opened: false
        }
    }

    render() {
        return (
            <div>
                <OpenCartButton setOpened={(newOpened) => this.setState({opened: newOpened})} />
                <CartDialog
                    handleClose={() => this.setState({opened: false})}
                    orderStep={this.props.orderStep}
                    opened={this.state.opened}/>
            </div>
        );
    }
}