import ReducerRegistry from '../base/redux/ReducerRegistry';

import { SET_PARTICIPANT_IN_PIP, SET_PARTICIPANT_TRACK, SET_PIP } from './actionTypes';

export interface IPictureInPictureState {
    isOpen: boolean;
    participantId?: string;
    pipWindow: Window | null;
    track?: any;
}

const DEFAULT_STATE = {
    isOpen: false,
    pipWindow: null
};

export interface IPictureInPictureAction extends IPictureInPictureState {
    type:
        typeof SET_PIP |
        typeof SET_PARTICIPANT_IN_PIP |
        typeof SET_PARTICIPANT_TRACK;
}

ReducerRegistry.register('features/picture-in-picture',
    (state: IPictureInPictureState = DEFAULT_STATE, action: IPictureInPictureAction) => {
        const { type, isOpen, pipWindow, track, participantId } = action;

        switch (type) {
        case SET_PIP:
            return {
                ...state,
                isOpen,
                pipWindow
            };
        case SET_PARTICIPANT_TRACK:
            return {
                ...state,
                track
            };
        default:
            return state;
        }
    });
