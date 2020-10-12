import React from 'react';
import MaskedInput from 'react-text-mask';
import TextField from '@material-ui/core/TextField';

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
            placeholderChar={'\u2000'}
        />
    );
}

export default function PhoneField(props) {
    return (
        <TextField
            label={props.label}
            value={props.value ?? ""}
            onChange={(event) => {
                props.resetError();
                props.setValue(event.target.value);
            }}
            name={props.name}
            id={props.id}
            variant="outlined"
            required={props.required}
            className={props.className}
            error={props.error}
            helperText={props.helperText ?? ""}
            style={{paddingBottom: 20}}
            InputProps={{
                inputComponent: TextMaskCustom,
            }}
        />
    );
}