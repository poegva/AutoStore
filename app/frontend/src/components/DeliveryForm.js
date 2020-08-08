import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import throttle from 'lodash/throttle';

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

function AddressField(props) {
    const classes = useStyles();

    const [value, setValue] = React.useState(null);
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

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
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
        setValue(newValue);
    }

    return (
        <Autocomplete
            id="address"
            getOptionSelected={(option, value) => option.address === value.address}
            getOptionLabel={(option) => option.address}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
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

export default function DeliveryForm(props) {
    const classes = useStyles();

    return (
        <Container className={classes.dialogContainer}>
            <Typography component="h5" variant="h5" align="center" className={classes.formInput}>
                Данные доставки
            </Typography>
            <Container className={classes.formContainer}>
                <AddressField />
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