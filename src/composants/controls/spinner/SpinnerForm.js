import React from 'react';
import SpinnerBase from './SpinnerBase';

const SpinnerForm = () => {
    return (
        <div className="loaderFormCss">
            <span style={{position:'fixed'}} >   
                <SpinnerBase />
            </span>  
        </div>
    );
};

export default SpinnerForm;