import Box from "@material-ui/core/Box";
import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "./Button";


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

    React.useEffect(() => {
        if (items.length === 0) {
            fetch(props.itemsUrl)
                .then(res => res.json())
                .then(
                    (result) => setItems(result.slice(0, 3)),
                    (error) => console.log(error)
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
                    <Grid item xs={12} md={4} key={item.id} style={{padding: 20, paddingLeft: 40, paddingRight: 40}} >
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
            {props.buttonLink ? (
                <Button link={props.buttonLink}>
                    {props.buttonText ?? props.buttonLink}
                </Button>
            ) : null}
        </Container>
    )
}