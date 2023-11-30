import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { IReduxState } from '../../app/types';

const Content = () => {
    const { isTrackMuted } = useSelector((state: IReduxState) => state['features/picture-in-picture']);
    const style: any = useMemo(() => {
        console.log("SCHIMB");
        return {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: isTrackMuted ? 'none' : 'block'
        };
    }, [ isTrackMuted ]);

    return (
        <>
            <video
                autoPlay = { true }
                id = 'largeVd'
                muted = { true }
                playsInline = { true }
                style = { style } />
        </>
    );
};

export default Content;
