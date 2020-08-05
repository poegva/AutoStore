import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {returnToContacts} from "../actions/OrderActions";

const useStyles = makeStyles((theme) => ({
    dialogContainer: {
        paddingBottom: theme.spacing(4),
    },
    formContainer: {
        display: "flex",
        flexDirection: "column",
    },
    formInput: {
        paddingBottom: theme.spacing(4),
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
    submitButton: {
        backgroundColor: "black",
        color: "white",
        '&:hover': {
            backgroundColor: "gray",
        }
    },
}));

export default function DeliveryForm(props) {
    const classes = useStyles();

    return (
        <Container className={classes.dialogContainer}>
            <Typography component="h5" variant="h5" align="center" className={classes.formInput}>
                Данные доставки
            </Typography>
            <Container className={classes.formContainer}>
                <TextField
                    id="name"
                    label="Адрес доставки"
                    variant="outlined"
                    className={classes.formInput}
                />
                <Button className={classes.submitButton}>
                    Заказать
                </Button>
                <Button onClick={props.returnToContacts}>
                    Назад
                </Button>
            </Container>
        </Container>
    );
}