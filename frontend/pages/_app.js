import React from "react";
import Layout from "../components/Layout";
import 'fontsource-roboto';
import { useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { wrapper } from "../redux/store";

function App({ Component, pageProps }) {
    const store = useStore((state) => state);

    return (
        <PersistGate loading={<div>loading...</div>} persistor={store.__persistor}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </PersistGate>
    )
}

export default wrapper.withRedux(App);