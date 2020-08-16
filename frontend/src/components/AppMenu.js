import makeStyles from "@material-ui/core/styles/makeStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import {Link as RouterLink} from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import CartButton from "../containers/CartButton";

const useStyles = makeStyles((theme) => ({
    appLogo: {
        [theme.breakpoints.down('sm')]: {
            height: "60px"
        }
    },
    toolbarLink: {
        padding: theme.spacing(1),
        flexShrink: 0,
        fontSize: 'large',
        color: 'black',
        fontFamily: 'roboto',
    }
}));

export default function AppMenu(props) {
    const classes = useStyles();
    const theme = useTheme();
    const matches = !useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = React.useState(false);

    if (matches) {
        return (
                <AppBar position="static" style={{backgroundColor: "white", boxShadow: 'none'}} >
                    <Container>
                    <Toolbar style={{justifyContent: matches ? "flex-start" : "space-between"}}>
                        <img src={props.image} className={classes.appLogo} alt=""/>
                        <Box>
                            {props.sections.map((section) => (
                                <Link
                                    key={section.title}
                                    href={section.url}
                                    className={classes.toolbarLink}
                                    component={RouterLink}
                                    to={section.url}
                                >
                                    {section.title}
                                </Link>
                            ))}
                        </Box>
                    </Toolbar>
                    </Container>
                </AppBar>
        );
    }

    return (
        <AppBar position="sticky" style={{backgroundColor: "white", boxShadow: 'none'}} >
            <Toolbar style={{justifyContent: "space-between"}}>
                <img src={props.image} className={classes.appLogo} alt=""/>
                    <CartButton setCartOpen={props.setCartOpen}/>
                    <MenuIcon style={{color: "black"}} fontSize="large" onClick={() => setOpen(true)}/>
                <Drawer open={open} onClose={() => setOpen(false)}>
                    <Box display="flex" flexDirection="column">
                        {props.sections.map((section) => (
                            <Link
                                key={section.title}
                                href={section.url}
                                className={classes.toolbarLink}
                                component={RouterLink}
                                to={section.url}
                                onClick={() => setOpen(false)}
                            >
                                {section.title}
                            </Link>
                        ))}
                    </Box>
                </Drawer>
            </Toolbar>
        </AppBar>
    )
}