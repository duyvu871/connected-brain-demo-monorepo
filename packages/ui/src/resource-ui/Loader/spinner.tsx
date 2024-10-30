import React from 'react';
import './rotate-loader.css';
import {cn} from "@repo/utils"

type RotateLoaderProps = {
  classNames?: {
    wrapper?: string;
    spinner?: string
  }
}

function RotateLoader(props: RotateLoaderProps): React.ReactNode {
    return (
        <div className={cn("flex-grow flex justify-center items-center", props?.classNames?.wrapper || "")}>
            <div className={cn('spinner', props?.classNames?.spinner || "")} />
        </div>
    );
}

export default RotateLoader;