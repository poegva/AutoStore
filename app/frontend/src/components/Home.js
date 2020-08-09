import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    title: {
        paddingTop: 200,
    }
}));

export default function Home() {
    const classes = useStyles();

    return (
        <Container>
            <Typography variant="h2" gutterBottom align='center' className={classes.title}>
                HQD Pods
            </Typography>
        </Container>
    )
}