import React from 'react';
import type { ToastContainerProps} from "react-toastify";
import {ToastContainer} from "react-toastify";
import {Toaster} from "@/global/contants/defaultComponentProps.ts";

interface ToastProps {
    children?: React.ReactNode;
};

function Toast({children}: ToastProps): JSX.Element {
    return (
        <>
            {children}
            <ToastContainer {...(Toaster as ToastContainerProps)} />
        </>
    );
}

export default Toast;