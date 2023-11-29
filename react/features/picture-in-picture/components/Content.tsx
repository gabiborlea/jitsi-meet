import React from 'react';

const style: any = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const Content = () => {
    const showVideo = true;

    if (showVideo) {
        return (
            <video
                autoPlay = { true }
                id = 'largeVd'
                muted = { true }
                playsInline = { true }
                style = { style } />
        );
    }

    return (<div>
        <h1>Ceva</h1>
    </div>);
};

export default Content;
