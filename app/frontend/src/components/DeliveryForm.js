import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import throttle from 'lodash/throttle';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import ContactFormContainer from "../container/ContactFormContainer";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import {setDeliverySelected} from "../actions/OrderActions";
import {useHistory} from "react-router-dom";

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

function validateHouse(address) {
    return address && address.addressComponents.some(c => c.kind === "HOUSE");
}

function AddressField(props) {
    const classes = useStyles();

    const value = props.address;
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    const getOptions = React.useMemo(
        () =>
            throttle((inputValue, callback) => {
                fetch(`api/delivery/complete/?address=${inputValue}`)
                    .then(result => result.json())
                    .then(callback)
            }, 500),
        [],
    );

    React.useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        getOptions(inputValue, (results) => {
            if (active) {
                let newOptions = [];

                if (results) {
                    newOptions = results;
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, getOptions]);

    function onChange(event, newValue) {
        setOptions(newValue ? [newValue, ...options] : options);
        props.setAddress(newValue);
    }

    return (
        <Autocomplete
            id="address"
            getOptionLabel={(option) => option.address}
            filterOptions={(x) => x}
            options={options}
            noOptionsText="Адрес не найден"
            autoComplete
            includeInputInList
            value={value}
            onChange={onChange}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Адрес"
                    variant="outlined"
                    className={classes.formInput}
                    helperText={validateHouse(value) ? null : "Укажите полный адрес"}
                    /*InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}*/
                />
            )}
        />
    );
}

function OptionCard(props) {
    const classes = useStyles();

    if (!props.option) {
        return null;
    }

    return (
        <Card>
            <FormControlLabel value={props.value} control={<Radio />} label={props.name} />
            <Typography>Стоимость: {props.option.cost.delivery} рублей </Typography>
        </Card>
    )
}

function DeliveryOptions(props) {
    if (!validateHouse(props.order.address)) {
        return null;
    }

    const classes = useStyles();
    const [error, setError] = React.useState('');

    const handleRadioChange = (event) => {
        props.setDeliverySelected(event.target.value);
        setError('');
    };

    if (props.order.delivery.options) {
        return (
            <FormControl component="fieldset" className={classes.formInput}>
                <RadioGroup aria-label="quiz" name="quiz" value={props.order.delivery.selected ?? ''} onChange={handleRadioChange}>
                    <OptionCard option={props.order.delivery.options['POST']} name="Почта" value="POST" />
                    <OptionCard option={props.order.delivery.options['COURIER']} name="Курьер" value="COURIER" />
                </RadioGroup>
                <FormHelperText error>{error}</FormHelperText>
            </FormControl>
        );
    } else {
        return <CircularProgress />;
    }

}

export default function DeliveryForm(props) {
    const classes = useStyles();

    function convertItemToData(item) {
        return {
            item: item.item.id,
            quantity: item.quantity,
        };
    }

    function submitOrder() {
        const isValid = true;

        if (!isValid) {
            // Do something it is shit
        } else {
            const orderData = {
                name: props.order.contacts.name,
                email: props.order.contacts.email,
                phone: props.order.contacts.phone,
                address: props.order.address,
                delivery_option: props.order.delivery.selected,
                items: Object.values(props.cart.content).map(item => convertItemToData(item))
            };

            props.submitOrder(orderData);
        }
    }

    return (
        <Container className={classes.dialogContainer}>
            <Typography component="h5" variant="h5" align="center" className={classes.formInput}>
                Данные доставки
            </Typography>
            <Container className={classes.formContainer}>
                <AddressField address={props.order.address} setAddress={props.setAddress}/>
                <DeliveryOptions order={props.order} setDeliverySelected={props.setDeliverySelected} />

                <Button className={classes.submitButton} onClick={submitOrder}>
                    Заказать
                </Button>
                <Button onClick={props.returnToContacts}>
                    Назад
                </Button>
            </Container>
        </Container>
    );
}