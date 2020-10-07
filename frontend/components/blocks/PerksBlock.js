import Box from "@material-ui/core/Box";
import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles((theme) => ({
    carousel: {
        minHeight: 750,
        [theme.breakpoints.down('sm')]: {
            minHeight: 500
        }
    }
}));

export default function PerksBlock(props) {
    const classes = useStyles();

    return (
        <Container fixed>
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
                {props.perks.map(perk => (
                    <Grid item xs={12} md={4} style={{padding: 40}} >
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                            <Box
                                style={{
                                    backgroundColor: perk.iconColor,
                                    borderRadius: 60,
                                    padding: 10,
                                    margin: 20
                                }}
                            >
                                {perk.icon}
                            </Box>
                            <Typography variant="h5" gutterBottom align='center' component="h2" style={{fontWeight: "bold"}}>{perk.title}</Typography>
                            <Typography variant="body1" gutterBottom align='center' component="h4">{perk.description}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}