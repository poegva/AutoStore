import Box from "@material-ui/core/Box";
import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles((theme) => ({
    carousel: {
        minHeight: 750,
        [theme.breakpoints.down('sm')]: {
            minHeight: 500
        }
    }
}));

export default function ShowcaseBlock(props) {
    const classes = useStyles();
    const [items, setItems] = React.useState([]);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        if (items.length === 0) {
            fetch(props.itemsUrl)
                .then(res => res.json())
                .then(
                    (result) => setItems(result.slice(0, 3)),
                    (error) => setError(true)
                )
        }
    }, [items]);

    console.log(items);

    return (
        <Container fixed style={{display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 40}}>
            <Typography
                variant="h3"
                gutterBottom
                align='center'
                component="h2"
                style={{paddingTop: 50, fontWeight: "bold"}}
            >
                {props.title}
            </Typography>
            <Grid container>
                {items.map(item => (
                    <Grid item xs={12} md={4} style={{padding: 20, paddingLeft: 40, paddingRight: 40}} >
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" >
                            <Box
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                    width: "100%",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    minHeight: 400,
                                    margin: 20
                                }}
                            >
                            </Box>
                            <Typography variant="h5" gutterBottom align='center' component="h2" style={{fontWeight: "bold"}}>{item.name}</Typography>
                            <Typography variant="body1" gutterBottom align='center' component="h4">{item.description}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            <Button
                size="large"
                component={Link}
                style={{
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: 25,
                    margin: 20,
                    paddingLeft: 40, paddingRight: 40, paddingTop: 10, paddingBottom: 10,
                    maxWidth: 300
                }}
                href={props.buttonLink}
                to={props.buttonLink}
            >
                {props.buttonText}
            </Button>
        </Container>
    )
}