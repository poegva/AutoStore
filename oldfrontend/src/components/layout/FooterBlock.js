import Container from "@material-ui/core/Container";
import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import logo from "../../logo.png";
import Link from "@material-ui/core/Link";

export default function FooterBlock(props) {
    return (
        <Container fixed>
            <Box display="flex" width="100%" justifyContent="space-between" style={{paddingTop: 20, paddingBottom: 20}} alignItems="center">
                <img src={logo} alt="" style={{maxWidth: "30%"}}/>
                <Typography variant="body1" component="h2" style={{maxWidth: "60%"}}>
                    E-mail: <Link href="mailto:info@hqdrussia.ru">info@hqdrussia.ru</Link>
                </Typography>
            </Box>
        </Container>
    )
}