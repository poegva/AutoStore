import Link from "next/link";
import MaterialButton from "@material-ui/core/Button";
import React from "react";

export default function Button(props) {
    return (
        <Link href={props.link}>
            <MaterialButton
                size="large"
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
        </Link>
    )
}