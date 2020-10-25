import React from "react";
import {useRouter} from "next/router";
import Box from "@material-ui/core/Box";
import TextBlock from "../../components/blocks/TextBlock";
import Paper from "@material-ui/core/Paper";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import ShowcaseBlock from "../../components/blocks/ShowcaseBlock";
import {addItem} from "../../redux/actions/OrderActions";
import {setCartOpen} from "../../redux/actions/GeneralActions";
import {connect} from "react-redux";

const useStyles = makeStyles((theme) => ({
    media: {
        height: 350,
        width: "100%",
        [theme.breakpoints.down('sm')]: {
            height: "150px",
        },
    },
}));

function Item(props) {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>
    }

    const allUsed = (
        props.item.shop_quantity === 0 ||
        props.cart[props.item.id] && props.cart[props.item.id].quantity >= props.item.shop_quantity
    );

    return (
        <React.Fragment>
            <Paper style={{
                padding: 30,
                marginLeft: (matches ? 100 : 30),
                marginRight: (matches ? 100 : 30),
                marginTop: (matches ? 40 : 30)
            }}>
                <Grid container>
                    <Grid item xs={12} md={6} style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingBottom: (matches ? 0 : 20)
                    }}>
                        <Box style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <Box
                                style={{
                                    backgroundImage: `url(${props.item.image})`,
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    minWidth: "15rem",
                                    maxWidth: 300,
                                    minHeight: 400
                                }}
                            >
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} style={{paddingLeft: 20, paddingRight: 20}}>
                        <Typography variant="h5" align={matches ? "left" : "center"} paragraph>{props.item.name}</Typography>
                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent={matches ? "left" : "space-between"} bgcolor="background.paper">
                            <Typography variant="h6" component="h6" align='center' style={{paddingRight: 20}}>
                                {props.item.price} ₽
                            </Typography>
                            <Button variant="outlined" size="large" disabled={allUsed} onClick={() => props.addItem(props.item)}>
                                Купить
                            </Button>
                        </Box>
                        <Typography style={{paddingTop: 20}} align={matches ? "left" : "center"}>{props.item.description}</Typography>
                    </Grid>
                </Grid>
            </Paper>
            <ShowcaseBlock title="Похожие товары" itemsUrl="/api/items" buttonLink="/shop" buttonText="Смотреть все"/>
        </React.Fragment>
    )
}

export async function getStaticPaths() {
    const res = await fetch(process.env.HOST + '/api/items/');
    const items = await res.json();

    return {
        paths: items.map(item => { return { params: { id: item.id.toString() } } }),
        fallback: true
    };
}

export async function getStaticProps({ params }) {
    const res = await fetch(process.env.HOST + `/api/items/${params.id}`);
    const item = await res.json();

    console.log(item);

    return {
        props: {
            item
        },
        revalidate: 3
    }
}

const mapStateToProps = store => {
    return {
        cart: store.order.cart,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addItem: item => dispatch(addItem(item)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Item);