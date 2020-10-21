import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Radio from "@material-ui/core/Radio";
import throttle from "lodash/throttle";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

function OptionCard(props) {
    let description;

    if (props.option) {
        description = (
            <Box display="flex" flexDirection="column">
                <Typography variant="body2">Стоимость: {props.option.cost} ₽</Typography>
                <Typography variant="body2">Дата: {props.option.date}</Typography>
                {props.option.extra ? <Typography variant="body2">{props.option.extra}</Typography> : null}
            </Box>
        )
    } else {
        let text = "Недоступно";
        let loading = false;
        if (!props.hasCity) {
            text = "Введите город";
        } else if (!props.hasOptions) {
            text = "Загрузка...";
            loading = true;
        }

        description = (
            <Box display="flex" flexDirection="column" justifyContent="center">
                <Box display="flex" style={{paddingTop: 9, paddingBottom: 9}}>
                    {loading ? <CircularProgress size={18} /> : null}
                    <Typography style={{paddingLeft: 10}} variant="body2">{text}</Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Card style={{paddingLeft: 10, paddingBottom: 10, marginTop: 10, marginBottom: 10}}>
            <FormControlLabel value={props.value} control={<Radio disabled={!props.option} />} label={props.name} />
            {description}
        </Card>
    )
}

function fetchOptions(address, itemsValue, callback) {
    const optionsEndpoint = window.location.protocol + "//" + window.location.hostname + "/api/delivery/options/";

    fetch(optionsEndpoint + `?value=${itemsValue}&address=${address.value}`)
        .then(r => r.json())
        .then(result => callback(result));
}

export default function DeliveryOptionField(props) {
    const [hasCity, setHasCity] = React.useState(false);
    const [types, setTypes] = React.useState(null);
    const [options, setOptions] = React.useState(null);

    const getOptions = React.useMemo(
        () =>
            throttle((address, itemsValue, callback) => fetchOptions(address, itemsValue, callback), 2000),
        [],
    );

    React.useEffect(() => {
        if (types == null) {
            const typesEndpoint =  window.location.protocol + "//" + window.location.hostname + "/api/delivery/types";
            fetch(typesEndpoint).then(r => r.json()).then(r => setTypes(r));
        }
    })

    React.useEffect(() => {
        if (props.address && props.address.hasCity) {
            setHasCity(true);
            setOptions(null);

            getOptions(props.address, props.itemsValue, (result) => setOptions(result));
        } else {
            setHasCity(false);
            setOptions(null);
        }
    }, [props.address, props.itemsValue, getOptions]);

    return (
        <FormControl
            component="fieldset"
            className={props.className}
            style={{paddingBottom: 20}}
        >
            <Typography align="center" variant="body1" style={{paddingBottom: 10}}>Варианты доставки</Typography>
            <RadioGroup
                aria-label="quiz"
                name={props.name}
                value={props.value ? props.value.type : ''}
                onChange={(event) => {
                    props.resetError();
                    props.setValue({
                        type: event.target.value,
                        option: options[event.target.value],
                        name: types.find(type => type.code === event.target.value).name
                    });
                }}
            >
                {types != null ? types.map(type => {
                    return (
                        <OptionCard
                            option={options ? options[type.code] : null}
                            name={type.name}
                            value={type.code}
                            hasCity={hasCity}
                            hasOptions={options != null}
                            key={type.code}
                        />
                    );
                }) : null}
            </RadioGroup>
            <FormHelperText error>{props.helperText}</FormHelperText>
        </FormControl>
    )
}