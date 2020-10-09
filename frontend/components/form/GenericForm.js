import Container from "@material-ui/core/Container";
import React from "react";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    dialogContainer: {
        paddingBottom: theme.spacing(4),
    },
    formContainer: {
        display: "flex",
        flexDirection: "column",
    },
    formInput: {
        paddingBottom: theme.spacing(4),
    },
    submitButton: {
        backgroundColor: "black",
        color: "white",
        '&:hover': {
            backgroundColor: "gray",
        }
    },
    backButton: {

    }
}));

function FormButton(props) {
    const classes = useStyles();

    return (
        <Button onClick={props.onClick} className={props.submit ? classes.submitButton : classes.backButton}>
            {props.children}
        </Button>
    )
}


export default class GenericForm extends React.Component {
    constructor(props) {
        super(props);

        let childrenMap = [];
        if (props.children) {
            if (Array.isArray(props.children)) {
                childrenMap = props.children;
            } else {
                childrenMap = [props.children];
            }
        }

        this.state = Object.fromEntries(childrenMap.map(
            c => [
                c.props.id,
                {
                    error: false,
                    helperText: ""
                }
            ]
        ));
    }

    validate(props) {
        let valid = true;

        let childrenMap = [];
        if (props.children) {
            if (Array.isArray(props.children)) {
                childrenMap = props.children;
            } else {
                childrenMap = [props.children];
            }
        }

        childrenMap.forEach(child => {
            if (child.props.required && (!child.props.value || child.props.value === '')) {
                valid = false;
                this.setState({
                    [child.props.id]: {
                        error: true,
                        helperText: "Это поле должно быть заполнено"
                    }
                });
            } else if (child.props.validate && !child.props.validate(child.props.value)) {
                valid = false;
                this.setState({
                    [child.props.id]: {
                        error: true,
                        helperText: child.props.validationText ?? "Некорректное значение"
                    }
                });
            } else {
                this.setState({
                    [child.props.id]: {
                        error: false,
                        helperText: ""
                    }
                });
            }
        });

        if (valid && props.submit) {
            props.submit();
        }
    }

    render() {
        return (
            <Container style={{display: "flex", flexDirection: "column"}}>
                {React.Children.map(this.props.children, child => {
                    return React.cloneElement(child, {
                        error: this.state[child.props.id].error,
                        helperText: this.state[child.props.id].helperText,
                        resetError: () => {
                            this.setState({
                                [child.props.id]: {
                                    error: false,
                                    helperText: ""
                                }
                            })
                        }
                    })
                })}
                <FormButton submit onClick={() => this.validate(this.props)}>
                    {this.props.submitText ?? "Далее"}
                </FormButton>
                {
                    this.props.returnBack ? (
                        <FormButton onClick={this.props.returnBack}>
                            Назад
                        </FormButton>
                    ) : null
                }
            </Container>
        );
    }

}