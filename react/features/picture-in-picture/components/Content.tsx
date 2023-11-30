import React from 'react';
import { useSelector } from 'react-redux';

import { IReduxState } from '../../app/types';
import Avatar from '../../base/avatar/components/Avatar';

const Content = () => {
    const { isTrackMuted, participantId, track } = useSelector(
        (state: IReduxState) => state['features/picture-in-picture']
    );
    const { localFlipX } = useSelector((state: IReduxState) => state['features/base/settings']);
    const mirrorTrack = track?.isLocal() && track.videoType !== 'desktop' && localFlipX;

    const styles = {
        video: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: mirrorTrack ? 'scaleX(-1)' : 'none',
            visibility: isTrackMuted ? 'hidden' : 'visible'
        },
        avatar: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            visibility: isTrackMuted ? 'visible' : 'hidden'
        }
    };

    return (
        <>
            <div style = { styles.avatar as any }>
                <Avatar
                    className = { 'userAvatar' }
                    participantId = { participantId }
                    size = { 100 } />
            </div>
            <video
                autoPlay = { true }
                id = 'largeVd'
                muted = { true }
                playsInline = { true }
                style = { styles.video as any } />
        </>
    );
};

export default Content;
