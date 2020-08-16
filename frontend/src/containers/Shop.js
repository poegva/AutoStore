import TextBlock from "../components/TextBlock";
import Container from "@material-ui/core/Container";
import React from "react";
import {connect} from "react-redux";
import {addItem} from "../redux/actions/OrderActions";
import ShopItemGrid from "../components/ShopItemGrid";
import ItemsLoading from "../components/ItemsLoading";


function Shop(props) {
    const [items, setItems] = React.useState(null);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        if (!items) {
            fetch(`http://${window.location.hostname}/api/items/`)
                .then(res => res.json())
                .then(
                    (result) => setItems(result),
                    (error) => setError(true)
                )
        }
    }, [items]);

    return (
        <Container style={{paddingTop: 20}} >
            <TextBlock title="HQD Cuvie" subtitle="Успей попробовать все вкусы!" />
            {items ?
                <ShopItemGrid items={items} addItem={props.addItem} /> :
                <ItemsLoading error={error} errorText="Что-то пошло не так" loadingText="Загрузка..." />}
        </Container>
    )
}

const mapStateToProps = store => {
    return {};
}

const mapDispatchToProps = dispatch => {
    return {
        addItem: item => dispatch(addItem(item))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Shop);