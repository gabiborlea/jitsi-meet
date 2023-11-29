import { IStateful } from '../base/app/types';
import { toState } from '../base/redux/functions';

import renderApp from './components/App';
import logger from './logger';

/**
 *
 */
export async function createPictureInPicture() {
    let pip = null;

    try {
        pip = await window.documentPictureInPicture.requestWindow({ width: 300,
            height: 300 });
    } catch (err) {
        logger.warn(`Could not create Picture in Picture ${err}`);

        return pip;
    }
    const root = pip.document.createElement('div');

    root.id = 'root';
    pip.document.body.setAttribute('style', 'margin:0; padding:0;');
    pip.document.body.append(root);
    renderApp(root);

    return pip;
}

/**
 *
 */
export function getPictureInPictureVideo(stateful: IStateful) {
    const state = toState(stateful);
    const { pipWindow } = state['features/picture-in-picture'];

    return pipWindow ? pipWindow.document.getElementById('largeVd') : null;
}

/**
 *
 */
export function disposePictureInPicture(pipWindow: Window) {
    // const largeVideoWrapper = document.getElementById('largeVideoWrapper');
    // const largeVideo = pipWindow.document.getElementById('largeVideo');

    // largeVideo && largeVideoWrapper?.append(largeVideo);
}
