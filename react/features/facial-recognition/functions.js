// @flow
import { getConferenceTimestamp } from '../base/conference/functions';

declare var APP: Object;

/**
 * Broadcasts the changed facial expression.
 *
 * @param  {string} facialExpression - Facial expression to be broadcasted.
 * @returns {void}
 */
export function sendFacialExpression(facialExpression: string): void {
    const count = APP.conference.membersCount;

    APP.conference.sendFacialExpression(facialExpression);

    if (count > 1) {
        const payload = {
            type: 'facial_expression',
            value: facialExpression
        };

        APP.conference.broadcastEndpointMessage(payload);
    }
}

/**
 * Detects facial expression.
 *
 * @param {Worker} worker - Facial expression worker.
 * @param {Object} imageCapture - Image capture that contains the current track.
 * @returns {Promise<void>}
 */
export async function detectFacialExpression(worker: Worker, imageCapture: Object): Promise<void> {
    const imageBitmap = await imageCapture.grabFrame();
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    context.drawImage(imageBitmap, 0, 0);

    const imageData = context.getImageData(0, 0, imageBitmap.width, imageBitmap.height);

    worker.postMessage({
        imageData
    });
}

/**
 * Gets the time with camera unmuted.
 *
 * @param  {Object} cameraTimeTracker - Object with the status, time unmuted and last update of the camera.
 * @returns {number}
 */
export function getCameraTime(cameraTimeTracker: {
    muted: boolean,
    cameraTime: number,
    lastCameraUpdate: number
}): number {
    let cameraTime = cameraTimeTracker.cameraTime;
    const state = APP.store.getState();
    const conferenceTimestamp = getConferenceTimestamp(state);

    if (!cameraTimeTracker.muted) {
        const currentTime = conferenceTimestamp
            ? new Date().getTime() - conferenceTimestamp
            : 0;

        cameraTime += currentTime - cameraTimeTracker.lastCameraUpdate;
    }

    return cameraTime;
}

/**
 * Sends updated for the camera time tracker to sever-side and other participants.
 *
 * @param  {boolean} muted - The status of the camera.
 * @param  {number} lastCameraUpdate - The time when the status of the camera changed last time.
 * @returns {void}
 */
export function sendCameraTimeTrackerUpdate(muted: boolean, lastCameraUpdate: number): void {
    const count = APP.conference.membersCount;

    APP.conference.sendCameraTimeTrackerUpdate({
        muted,
        lastCameraUpdate
    });

    if (count > 1) {
        const payload = {
            type: 'camera_time_tracker',
            muted,
            lastCameraUpdate
        };

        APP.conference.broadcastEndpointMessage(payload);
    }
}
