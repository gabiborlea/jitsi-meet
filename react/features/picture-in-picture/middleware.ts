import { AnyAction } from 'redux';

import { IStore } from '../app/types';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';

import { SET_PARTICIPANT_IN_PIP } from './actionTypes';
import { setTrackOnVideo } from './actions';

MiddlewareRegistry.register(({ dispatch }: IStore) => (next: Function) => (action: AnyAction) => {
    switch (action.type) {
    case SET_PARTICIPANT_IN_PIP:
        dispatch(setTrackOnVideo(action.track));
        break;
    }

    return next(action);
});
