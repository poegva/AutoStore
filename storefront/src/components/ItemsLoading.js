import Box from "@material-ui/core/Box";
import ErrorIcon from "@material-ui/icons/Error";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";

export default function ItemsLoading(props) {
    if (props.error) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" style={{paddingTop: 20}}>
                <ErrorIcon color="secondary" fontSize="large" style={{ alignSelf: "center" }}/>
                <Typography align="center" component="h5" variant={props.variant ?? "h5"}>
                    {props.errorText ?? "Ошибка загрузки"}
                </Typography>
            </Box>
        );
    } else {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" style={{paddingTop: 20}}>
                <CircularProgress style={{alignSelf: "center"}}/>
                <Typography align="center" component="h5" variant={props.variant ?? "h5"}>
                    {props.loadingText ?? "Загрузка..."}
                </Typography>
            </Box>
        );
    }
}