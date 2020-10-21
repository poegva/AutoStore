import React from "react";
import Layout from "../components/Layout";
import 'fontsource-roboto';
import { wrapper } from "../redux/store";
import Head from "next/head";

function App({ Component, pageProps }) {
    return (
        <Layout>
            <Head>
                <title>HQD - Удобно. Вкусно</title>
                <meta charSet="UTF-8" key="charset" />
                <meta name="robots" content="index, follow" key="robots" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" key="viewport" />
            </Head>
            <Component {...pageProps} />
        </Layout>
    )
}

export default wrapper.withRedux(App);