import React from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 350,
    },
    title: {
        paddingTop: 50,
    },
    subtitle: {
    },
    buyButton: {
        backgroundColor: "black",
        color: "white",
        '&:hover': {
            backgroundColor: "gray",
        }
    },
    itemGrid: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(8),
    },
    itemCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
}));

function ItemCard(props) {
    const classes = useStyles();

    return (
        <Card>
            <CardMedia
                image={props.item.image}
                title={props.item.name}
                className={classes.media}
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="h2" align='center'>
                    {props.item.name}
                </Typography>
                <Box display="flex" flexDirection="row" justifyContent="space-around" bgcolor="background.paper">
                    <Button className={classes.buyButton} onClick={props.buyItem}>
                        Купить
                    </Button>
                    <Typography gutterBottom variant="h6" component="h6" align='center'>
                        {props.item.price} ₽
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

function ItemGrid(props) {
    const classes = useStyles();

    return (
        <Container maxWidth="lg" className={classes.itemGrid}>
            <Grid container spacing={4} >
                {props.items.map(item => (
                    <Grid item xs={12} sm={6} md={3} key={item.id} className={classes.itemCard}>
                        <ItemCard item={item} buyItem={() => props.addItem(item)}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

class ItemDisplayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
        };
    }

    componentDidMount() {
        fetch("api/items/")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const {error, isLoaded, items} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <CircularProgress/>;
        } else {
            return <ItemGrid items={items} addItem={this.props.addItem} />;
        }
    }

}

function Shop(props) {
    const classes = useStyles();

    return (
        <Container>
            <Typography variant="h2" gutterBottom align='center' className={classes.title} component="h2">
                HQD Cuvie
            </Typography>

            <Typography variant="h4" gutterBottom align='center' className={classes.subtitle}>
                Успей попробовать каждый вкус HQD Cuvie
            </Typography>

            <ItemDisplayer addItem={props.addItem} />
        </Container>
    )
}

export {Shop}