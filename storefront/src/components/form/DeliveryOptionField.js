import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Radio from "@material-ui/core/Radio";

function OptionCard(props) {
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

export default function DeliveryOptionField(props) {
    if (!props.options) {
        return null;
    }

    return (
        <FormControl
            component="fieldset"
            className={props.className}
            style={{paddingBottom: 20}}
        >
            <RadioGroup
                aria-label="quiz"
                name={props.name}
                value={props.value ?? ''}
                onChange={(event) => {
                    props.resetError();
                    props.setValue(event.target.value);
                }}
            >
                <OptionCard option={props.options['POST']} name="Почта" value="POST" />
                <OptionCard option={props.options['COURIER']} name="Курьер" value="COURIER" />
            </RadioGroup>
            <FormHelperText error>{props.helperText}</FormHelperText>
        </FormControl>
    )
}