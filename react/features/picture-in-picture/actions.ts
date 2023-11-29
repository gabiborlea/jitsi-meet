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

        const pipWindow = await createPictureInPicture();
        const video = getPictureInPictureVideo(getState());

        track?.attach(video);

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
export function setParticipantInPictureInPicture(track: any, participantId: string) {
    return {
        type: SET_PARTICIPANT_IN_PIP,
        track,
        participantId
    };
}

/**
 *
 * @returns
 */
export function setTrackOnVideo(track: any) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const {
            track: prevTrack,
            isOpen
        } = state['features/picture-in-picture'];
        const video = getPictureInPictureVideo(state);

        if (isOpen && track !== prevTrack) {
            prevTrack?.detach(video);
            track?.attach(video);
        }
        dispatch({
            type: SET_PARTICIPANT_TRACK,
            track
        });
    };
}

/**
 *
 * @returns
 */
export function setAvatar() {
    return (_dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const {
            participantId: prevParticipantId
        } = state['features/picture-in-picture'];

        // if (track !== prevTrack) {
        //     const video = getPictureInPictureVideo(state);

        //     prevTrack.detach(video);
        //     track.attach(video);
        // }
    };
}

/**
 *
 * @returns
 */
export function closePictureInPicture() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const { pipWindow } = getState()['features/picture-in-picture'];

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
