import { IStore } from '../app/types';

import { SET_PARTICIPANT_IN_PIP, SET_PARTICIPANT_TRACK, SET_PIP } from './actionTypes';
import { createPictureInPicture, disposePictureInPicture, getPictureInPictureVideo } from './functions';

/**
 *
 * @returns
 */
export function openPictureInPicture() {
    return async (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const { track, participantId } = getState()['features/picture-in-picture'];

        const { pipWindow, video } = await createPictureInPicture();

        video && track?.attach(video);

        pipWindow?.addEventListener('pagehide', () => {
            dispatch(closePictureInPicture());
        }, { once: true });

        dispatch({
            type: SET_PIP,
            isOpen: pipWindow !== null,
            pipWindow
        });
    };
}

/**
 *
 * @param track
 * @param participantId
 * @returns
 */
export function setParticipantInPictureInPicture(track: any, participantId: string, isTrackMuted?: boolean) {
    return {
        type: SET_PARTICIPANT_IN_PIP,
        track,
        participantId,
        isTrackMuted
    };
}

/**
 *
 * @returns
 */
export function setTrackOnVideo(track: any, isMuted?: boolean) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const {
            track: prevTrack,
            isOpen
        } = state['features/picture-in-picture'];
        const video = getPictureInPictureVideo(state);

        if (isOpen && track !== prevTrack && video) {
            prevTrack?.detach(video);
            track?.attach(video);
        }

        let isTrackMuted = track?.isMuted() ?? true;

        if (typeof isMuted !== 'undefined') {
            isTrackMuted = isMuted;
        }
        dispatch({
            type: SET_PARTICIPANT_TRACK,
            track,
            isTrackMuted
        });
    };
}

/**
 *
 * @returns
 */
export function closePictureInPicture() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const { pipWindow, track } = getState()['features/picture-in-picture'];
        const video = getPictureInPictureVideo(getState());

        video && track?.detach(video);

        pipWindow && disposePictureInPicture(pipWindow);
        pipWindow?.close();

        dispatch({
            type: SET_PIP,
            isOpen: false,
            pipWindow: null
        });
    };
}

/**
 *
 * @returns
 */
export function togglePictureInPicture() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const { isOpen } = getState()['features/picture-in-picture'];

        if (isOpen) {
            dispatch(closePictureInPicture());
        } else {
            dispatch(openPictureInPicture());
        }
    };
}
