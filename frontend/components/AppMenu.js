import makeStyles from "@material-ui/core/styles/makeStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import CartButton from "./CartButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import NextLink from 'next/link';
import {useDispatch} from "react-redux";
import {setCartOpen} from "../redux/actions/GeneralActions";

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
    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const matches = !useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = React.useState(false);

    let content = null;

    if (matches) {
        content = (
            <React.Fragment>
                <Box>
                    {props.sections.map((section) => (
                        <NextLink href={section.url}>
                            <Link
                                key={section.title}
                                href={section.url}
                                to={section.url}
                                className={classes.toolbarLink}
                            >
                                {section.title}
                            </Link>
                        </NextLink>
                    ))}
                </Box>
            </React.Fragment>
        )
    } else {
        content = (
            <React.Fragment>
                <CartButton setCartOpen={() => dispatch(setCartOpen(true))}/>
                <MenuIcon style={{color: "black"}} fontSize="large" onClick={() => setOpen(true)}/>
                <Drawer
                    open={open}
                    onClose={() => setOpen(false)}
                    PaperProps={{
                        style: {width: "80%"}
                    }}
                >
                    <List>
                        {props.sections.map((section) => (
                            <ListItem>
                                <NextLink href={section.url}>
                                    <Link
                                        key={section.title}
                                        href={section.url}
                                        className={classes.toolbarLink}
                                        to={section.url}
                                        onClick={() => setOpen(false)}
                                    >
                                        {section.title}
                                    </Link>
                                </NextLink>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </React.Fragment>
        )
    }

    return (
        <AppBar position="fixed" style={{backgroundColor: "white", boxShadow: 'none', minHeight: "2.5rem"}}>
            <Container>
                <Toolbar style={{justifyContent: matches ? "flex-start" : "space-between"}}>
                    <img src="/logo.png" alt="" className={classes.appLogo}/>
                    {content}
                </Toolbar>
            </Container>
        </AppBar>
    );
}