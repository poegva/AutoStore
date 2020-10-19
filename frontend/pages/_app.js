import React from "react";
import Layout from "../components/Layout";
import 'fontsource-roboto';
import { wrapper } from "../redux/store";

function App({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}

export default wrapper.withRedux(App);