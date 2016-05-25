import React from "react";
import classNames from "classnames";

export default function Backdrop(props) {
    const className = classNames({
        "backdrop": true,
        "backdrop--enabled": props.enabled,
    });

    return (
        <div className={className}></div>
    );
};
