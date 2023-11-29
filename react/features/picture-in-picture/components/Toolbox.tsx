import React from 'react';

import MuteVideoButton from './MuteVideoButtons';

const style: any = {
    position: 'absolute',
    bottom: '3',
    left: '50%',
    transform: 'translate(-50%)'
};

const ToolBox = () => (
    <div
        id = 'toolbox'
        style = { style }>
        <MuteVideoButton />
    </div>
);

export default ToolBox;
