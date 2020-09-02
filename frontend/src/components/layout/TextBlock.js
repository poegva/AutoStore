import Container from "@material-ui/core/Container";
import React from "react";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useTheme from "@material-ui/core/styles/useTheme";
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom";
import Button from "./Button";

export default function TextBlock(props) {
    const theme = useTheme();
    const matches = !useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container
            maxWidth="md"
            style={{
                paddingTop: props.padding ?? 0,
                paddingBottom: props.padding ?? 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Typography
                variant="h2"
                gutterBottom
                align='center'
                component="h2"
                style={{paddingBottom: props.padding, fontWeight: "bold", fontSize: matches ? "5rem" : "3rem"}}
            >
                {props.title}
            </Typography>
            <Typography variant={matches ? "h5" : "h6"} gutterBottom align='center' style={{maxWidth: matches ? "50%" : "90%"}}>
                {props.subtitle}
            </Typography>
            {props.image ? (
                <Box
                    style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        display: "block",
                        width: "70%",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundImage: `url(${props.image})`,
                        minHeight: 50,
                        padding: props.padding,
                        margin: props.padding,
                    }}
                >
                </Box>
            ) : null}
            {props.buttonText ? (
                <Button link={props.buttonLink}>
                    {props.buttonText}
                </Button>
            ) : null}
        </Container>
    )
}