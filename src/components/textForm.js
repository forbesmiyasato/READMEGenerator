import React from "react";
import Form from "react-bootstrap/Form";
import { Justify } from "react-bootstrap-icons";
//Text input custom componenet to reduce repeated code.
const TextForm = (props) => {
    const {
        id,
        label,
        placeholder,
        text,
        type,
        as = "input",
        onChange,
        value,
        onKeyDown,
        stackable
    } = props;

    return (
        <Form.Group className={id} controlId={id}>
            <div className={stackable && "d-flex flex-row justify-content-between p-1 align-items-center"}>
            <Form.Label>{label}</Form.Label>
            {stackable && <Justify />}
            </div>
            <Form.Control
                value={value}
                onChange={onChange}
                as={as}
                type={type}
                placeholder={placeholder}
                onKeyDown={onKeyDown}
            />
            <Form.Text className="text-muted">{text}</Form.Text>
        </Form.Group>
    );
};

export default TextForm;
