import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

export default function CheckboxField(props) {
    return (
        <FormControl required error={props.error} component="fieldset" style={{paddingBottom: 20}}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={props.value}
                        onChange={event => {
                            props.resetError();
                            props.setValue(event.target.checked);
                        }}
                    />
                }
                label={props.label}
            />
            {props.error ? <FormHelperText>{props.helperText}</FormHelperText> : null}
        </FormControl>
    )
}