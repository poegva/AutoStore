import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import TextField from "@material-ui/core/TextField";
import throttle from 'lodash/throttle';

export default function AddressField(props) {

    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    const getOptions = React.useMemo(
        () =>
            throttle((inputValue, callback) => {
                fetch(`http://${window.location.hostname}:9000/api/delivery/complete/?address=${inputValue}`)
                    .then(result => result.json())
                    .then(callback)
            }, 500),
        [],
    );

    React.useEffect(() => {
        let active = true;

        console.log(inputValue);

        if (inputValue === '') {
            setOptions(props.value ? [props.value] : []);
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
    }, [props.value, inputValue, getOptions]);


    return (
        <Autocomplete
            id="address"
            getOptionLabel={(option) => option.address}
            filterOptions={(x) => x}
            options={options}
            noOptionsText="Адрес не найден"
            autoComplete
            includeInputInList
            value={props.value}
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                props.resetError();
                props.setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.label}
                    name={props.name}
                    id={props.id}
                    variant="outlined"
                    required={props.required}
                    className={props.className}
                    error={props.error}
                    helperText={props.helperText ?? ""}
                    style={{paddingBottom: 20}}
                />
            )}
        />
    );
}