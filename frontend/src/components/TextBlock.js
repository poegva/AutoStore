import Container from "@material-ui/core/Container";
import React from "react";
import Typography from "@material-ui/core/Typography";

export default function TextBlock(props) {
    return (
        <Container>
            <Typography variant="h2" gutterBottom align='center' component="h2">
                {props.title}
            </Typography>

            <Typography variant="h4" gutterBottom align='center'>
                {props.subtitle}
            </Typography>
        </Container>
    )
}