import React from "react";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    imageBlock: {
        height: 350,
        width: "100%",
        backgroundPosition: "center",
        backgroundSize: "auto",
        backgroundRepeat: "no-repeat",
        [theme.breakpoints.down('sm')]: {
            backgroundSize: "100%",
            height: 250
        }
    },
}));

export default function ImageBlock(props) {
    const classes = useStyles();

    return (
        <Box className={classes.imageBlock} style={{backgroundImage: `url(${props.image})`}}>
        </Box>
    )
}