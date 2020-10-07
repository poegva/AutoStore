import React from 'react';
import TextField from '@material-ui/core/TextField';

export default function BasicField(props) {
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
        />
    );
}