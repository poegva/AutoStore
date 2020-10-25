import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useTheme from "@material-ui/core/styles/useTheme";
import CardActionArea from "@material-ui/core/CardActionArea";
import {useRouter} from "next/router";

const useStyles = makeStyles((theme) => ({
    media: {
        height: 350,
        [theme.breakpoints.down('sm')]: {
            height: "150px"
        },
        "&:hover $description": {
            opacity: 1
        }
    },
    itemCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    description: {
        position: "absolute",
        width: "100%",
        height: "inherit",
        background: "rgba(0, 0, 0, 0.7)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity: 0
    },
    overlay: {
        transition: ".5s ease",
        opacity: 0.5,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        "-ms-transform": "translate(-50%, -50%)"
    },
    buyButton: {
        /*backgroundColor: "black",
        color: "white",
        '&:hover': {
            backgroundColor: "gray",
        }
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 16,
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        borderColor: '#0063cc',
        backgroundColor: "black",
        '&:hover': {
            backgroundColor: '#0069d9',
            borderColor: '#0062cc',
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        },*/
    },
}));

export default function ShopItemCard(props) {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const router = useRouter();

    let content = null;

    const allUsed = props.item.shop_quantity === 0 || props.cartItem && props.cartItem.quantity >= props.item.shop_quantity;

    if (matches) {
        content = (
            <CardContent style={{flexGrow: "1"}}>
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                    <Typography gutterBottom variant="h6" component="h2" align='center'>
                        {props.item.name}
                    </Typography>
                    <Box display="flex" flexDirection="row" justifyContent="space-around" bgcolor="background.paper">
                        <Button variant="outlined" disabled={allUsed} className={classes.buyButton} onClick={props.addItem}>
                            Купить
                        </Button>
                        <Typography gutterBottom variant="h6" component="h6" align='center'>
                            {props.item.price} ₽
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        )
    } else {
        content = (
            <CardContent style={{paddingBottom: 0, flexGrow: "1"}}>
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                    <Typography gutterBottom variant="body2" component="h2" align='center' paragraph>
                        {props.item.name}
                    </Typography>
                    <Box>
                        <Box display="flex" flexDirection="row" justifyContent="space-around" bgcolor="background.paper">
                            <Button variant="outlined" disabled={allUsed} className={classes.buyButton} onClick={(event) => {
                                event.preventDefault();
                                props.addItem();
                            }}>
                                Купить
                            </Button>
                        </Box>
                        <Typography gutterBottom variant="body1" component="h6" align='center' style={{paddingTop: 5}}>
                            {props.item.price} ₽
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        )
    }

    return (
        <Card style={{height: "100%", flexFlow: "column", display: "flex", position: "relative"}}>
            <CardActionArea onClick={() => router.push(`/item/${props.item.id}`).then(() => window.scrollTo(0, 0))}>
                <CardMedia
                    image={props.item.image}
                    title={props.item.name}
                    className={classes.media}
                >
                    <Box className={classes.description}>
                        <Typography align="center" style={{padding: 10}}>
                            {props.item.description}
                        </Typography>
                    </Box>
                </CardMedia>
            </CardActionArea>
            {content}
        </Card>
    )


}