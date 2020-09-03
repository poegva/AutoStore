import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import TextField from "@material-ui/core/TextField";
import throttle from 'lodash/throttle';

function suggestAddress(inputValue, callback) {
    const suggestUrl= window.location.protocol + "//" + window.location.hostname + "/api/delivery/complete?address=" + inputValue;
    fetch(suggestUrl)
        .then(result => result.json())
        .then(result => {
            callback(result.map(suggestion => {
                return {
                    value: suggestion.value,
                    hasCity: suggestion.data.city || suggestion.data.settlement,
                    hasHouse: suggestion.data.house != null
                };
            }))
        });
}

export default function AddressField(props) {

    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    const getOptions = React.useMemo(
        () =>
            throttle((inputValue, callback) => suggestAddress(inputValue, callback), 1000),
        [],
    );

    React.useEffect(() => {
        let active = true;

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
            getOptionLabel={(option) => option.value}
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