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

const useStyles = makeStyles((theme) => ({
    media: {
        height: 350,
        [theme.breakpoints.down('sm')]: {
            height: "150px"
        }
    },
    buyButton: {
        backgroundColor: "black",
        color: "white",
        '&:hover': {
            backgroundColor: "gray",
        }
    },
    itemCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
}));

export default function ShopItemCard(props) {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    let content = null

    if (matches) {
        content = (
            <CardContent style={{flexGrow: "1"}}>
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                    <Typography gutterBottom variant="h6" component="h2" align='center'>
                        {props.item.name}
                    </Typography>
                    <Box display="flex" flexDirection="row" justifyContent="space-around" bgcolor="background.paper">
                        <Button className={classes.buyButton} onClick={props.addItem}>
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
                            <Button className={classes.buyButton} onClick={props.addItem}>
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
        <Card style={{height: "100%", flexFlow: "column", display: "flex"}}>
            <CardMedia
                image={props.item.image}
                title={props.item.name}
                className={classes.media}
            />
            {content}
        </Card>
    )


}