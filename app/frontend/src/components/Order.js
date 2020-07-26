import React from "react";
import {useParams} from "react-router-dom";

export function Order(props) {
    let {id} = useParams();

    return (
        <p>orderid {id}</p>
    )

}