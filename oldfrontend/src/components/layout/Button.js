import {Link} from "react-router-dom";
import MaterialButton from "@material-ui/core/Button";
import React from "react";

export default function Button(props) {
    return (
        <MaterialButton
            size="large"
            component={Link}
            style={{
                backgroundColor: "black",
                color: "white",
                borderRadius: 35,
                margin: 20,
                paddingLeft: 40, paddingRight: 40, paddingTop: 10, paddingBottom: 10,
                fontSize: "1.5rem",
            }}
            href={props.link}
            to={props.link}
        >
            {props.children}
        </MaterialButton>
    )
}