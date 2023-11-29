import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IReduxState } from '../../app/types';
import { MEDIA_TYPE } from '../../base/media/constants';
import { isLocalTrackMuted } from '../../base/tracks/functions';
import { handleToggleVideoMuted } from '../../toolbox/actions';


const MuteVideoButton = () => {
    const isMuted = useSelector((state: IReduxState) => {
        const tracks = state['features/base/tracks'];

        return isLocalTrackMuted(tracks, MEDIA_TYPE.VIDEO);
    });
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
        console.log('HEY');
        dispatch(handleToggleVideoMuted(!isMuted, true, true));
    }, [ isMuted, dispatch ]);

    return (

        <button
            id = 'muteVideo'
            onClick = { handleClick }>
            { isMuted ? 'unmute' : 'mute' }
        </button>

    );
};

export default MuteVideoButton;
