import { IStore } from '../app/types';

import { SET_PARTICIPANT_IN_PIP, SET_PARTICIPANT_TRACK, SET_PIP } from './actionTypes';
import {
    createPictureInPicture,
    disposePictureInPicture,
    getPictureInPictureVideo,
    isPictureInPictureEnabled
} from './functions';

/**
 * Action that opens a new picture in picture.
 *
 * @returns {Function}
 */
export function openPictureInPicture() {
    return async (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        if (!isPictureInPictureEnabled()) {
            return;
        }
        const { track } = getState()['features/picture-in-picture'];

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
 * Action that sets the participant's details: the participantId and its video track.
 *
 * @param {any} track - Participant's video track: camera or desktop.
 * @param {string} participantId - Participant's id.
 * @param {boolean | undefined} isTrackMuted - Wether the participant's track is muted or not.
 * @returns {Object}
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
 * Action that attaches the video track to the video in picture in picture.
 *
 * @param {any} track - Participant's video track: camera or desktop.
* @param {boolean | undefined} isMuted - Wether the participant's track is muted or not.
 * @returns {Function}
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
 * Action that closes a new picture in picture and handles its disposal.
 *
 * @returns {Function}
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
 * Action that toggles the picture in picture window.
 *
 * @returns {Function}
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
