import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link as RouterLink
} from "react-router-dom";

import {Home} from './Home';
import Toolbar from "@material-ui/core/Toolbar";
import Link from '@material-ui/core/Link';
import AppBar from "@material-ui/core/AppBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import * as PropTypes from "prop-types";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import ShopContainer from "../container/ShopContainer";
import CartContainer from "../container/CartContainer";

const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundColor: 'white',
        boxShadow: 'none',
    },
    toolbarLink: {
        padding: theme.spacing(1),
        flexShrink: 0,
        fontSize: 'large',
        color: 'black',
        fontFamily: 'roboto',
    },
    content: {
        backgroundColor: '#F6F6F6'
    },
    centered: {
    }
}));

function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

function AppNavigationBar(props) {
    const classes = useStyles();

    return (
        <HideOnScroll {...props}>
            <AppBar
                position="static"
                color="transparent"
                className={classes.appBar}
            >
                <Container className={classes.centered}>
                    <Box display="flex" flexDirection="row">
                        <img src="/static/logo.png"/>
                        <Toolbar>
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
                        </Toolbar>
                    </Box>
                </Container>
            </AppBar>
        </HideOnScroll>
    )
}

function App(props) {
    const classes = useStyles();
    const sections = [
        {
            title: 'Главная',
            url: '/',
        },
        {
            title: 'Отзывы',
            url: '/reviews',
        },
        {
            title: 'Магазин',
            url: '/shop',
        },
    ];

    return (
        <Router>
            <AppNavigationBar sections={sections} />

            <CartContainer />

            <div className={classes.content}>
                <Switch>
                    <Route path="/reviews"> <p>dd</p> </Route>
                    <Route path="/shop"> <ShopContainer /> </Route>
                    <Route path="/"> <Home /> </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;