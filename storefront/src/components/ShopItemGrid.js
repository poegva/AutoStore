import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import React from "react";
import ShopItemCard from "./ShopItemCard";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    itemGrid: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(8),
    }
}));

export default function ItemGrid(props) {
    const classes = useStyles();

    return (
        <Container maxWidth="lg" className={classes.itemGrid}>
            <Grid container spacing={2} >
                {props.items.map(item => (
                    <Grid item xs={6} sm={4} md={3} key={item.id} className={classes.itemCard}>
                        <ShopItemCard item={item} addItem={() => props.addItem(item)}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}