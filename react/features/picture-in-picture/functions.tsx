import { IStateful } from '../base/app/types';
import { toState } from '../base/redux/functions';

import renderApp from './components/App';
import logger from './logger';

/**
 *
 */
export async function createPictureInPicture() {
    let pipWindow: Window | null = null;

    try {
        pipWindow = await window.documentPictureInPicture.requestWindow({ width: 500,
            height: 300 });
    } catch (err) {
        logger.warn(`Could not create Picture in Picture ${err}`);

    }

    if (pipWindow) {
        const root = pipWindow.document.createElement('div');

        root.id = 'root';
        pipWindow.document.body.setAttribute('style', 'margin:0; padding:0;');
        pipWindow.document.body.append(root);
        renderApp(root);
    }

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

    return {
        pipWindow,
        video: pipWindow?.document.getElementById('largeVd')
    };
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


}
