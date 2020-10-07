import Box from "@material-ui/core/Box";
import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {Link} from "react-router-dom";
import SwipeableViews from 'react-swipeable-views';
import { autoPlay, virtualize } from 'react-swipeable-views-utils';
import { mod } from 'react-swipeable-views-core';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "./Button";

const VirtualizeAutoPlaySwipeableViews = virtualize(autoPlay(SwipeableViews));

const useStyles = makeStyles((theme) => ({
    carousel: {
        minHeight: 750,
        [theme.breakpoints.down('sm')]: {
            minHeight: 500
        }
    }
}));

export default function CarouselBlock(props) {
    const [index, setIndex] = React.useState(0);
    const classes = useStyles();

    function slideRenderer(params) {
        const { index, key } = params;

        return (
            <img
                src={props.images[mod(index, props.images.length)]}
                key={key}
                style={{
                    maxHeight: 500,
                        maxWidth: "100%",
                        display: "block",
                        margin: "0 auto",
                }}
            />
        );
    }

    return (
        <Container fixed>
        <Grid container>
            <Grid item xs={12} md={6} className={classes.carousel}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                    <Typography
                        variant="h2"
                        gutterBottom
                        align='center'
                        component="h1"
                        style={{fontWeight: "bold", fontSize: "5rem"}}
                    >
                        {props.title}
                    </Typography>
                    <Typography
                        variant="h4"
                        gutterBottom
                        align='center'
                        component="h3"
                        style={{fontWeight: "bold", fontSize: "2.5rem"}}
                    >
                        {props.subtitle}
                    </Typography>
                    <Button link={props.buttonLink}>
                        {props.buttonText}
                    </Button>
                </Box>
            </Grid>
            <Grid item xs={12} md={6} className={classes.carousel}>
                <Box display="flex" flexDirection="column" justifyContent="space-around" height="100%">
                    <VirtualizeAutoPlaySwipeableViews index={index} onChangeIndex={setIndex} slideRenderer={slideRenderer} />
                </Box>
            </Grid>
        </Grid>
        </Container>
    )
}