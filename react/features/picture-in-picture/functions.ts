import { IStateful } from '../base/app/types';
import { toState } from '../base/redux/functions';

import { mountApp, unmountApp } from './components/App';
import logger from './logger';

/**
 * Indicates whether picture in picture in enabled.
 *
 * @returns {boolean}
 */
export function isPictureInPictureEnabled() {
    if ('documentPictureInPicture' in window) {
        return true;
    }

    return false;
}

/**
 *  Creates a new document picture in picture.
 *
 * @returns {Object} - Returns the new video with the video.
 */
export async function createPictureInPicture() {
    let pipWindow: Window | null = null;

    if (!isPictureInPictureEnabled()) {
        return {
            pipWindow: null,
            video: null
        };
    }

    try {
        pipWindow = await window.documentPictureInPicture?.requestWindow({ width: 500,
            height: 300 }) ?? null;
    } catch (err) {
        logger.warn(`Could not create Picture in Picture ${err}`);

    }

    if (pipWindow) {
        const root = pipWindow.document.createElement('div');

        root.id = 'root';
        pipWindow.document.body.setAttribute('style', 'margin:0; padding:0;');
        pipWindow.document.body.append(root);
        mountApp(root);

        Array.from(document.styleSheets).forEach(styleSheet => {
            try {
                const cssRules = Array.from(styleSheet.cssRules)
                                    .map(rule => rule.cssText)
                                    .join('');
                const style = document.createElement('style');

                style.textContent = cssRules;
                pipWindow?.document.head.appendChild(style);
            } catch (e) {
                const link = document.createElement('link');

                link.rel = 'stylesheet';
                link.type = styleSheet.type;
                link.href = styleSheet.href ?? '';
                pipWindow?.document.head.appendChild(link);
            }
        });
    }

    return {
        pipWindow,
        video: pipWindow?.document.getElementById('largeVd')
    };
}

/**
 * Returns the video element in the picture and picture window.
 *
 * @param {IStateful} stateful - A redux stateful object.
 * @returns {HTMLVideoElement}
 */
export function getPictureInPictureVideo(stateful: IStateful) {
    const state = toState(stateful);
    const { pipWindow } = state['features/picture-in-picture'];

    return pipWindow ? pipWindow.document.getElementById('largeVd') : null;
}

/**
 * Disposes the react components from the window.
 *
 * @param {Window} pipWindow - The picture in picture Window.
 * @returns {void}
 */
export function disposePictureInPicture(pipWindow: Window) {
    const root = pipWindow.document.getElementById('root');

    root && unmountApp(root);
}