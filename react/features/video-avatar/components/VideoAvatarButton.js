// @flow

import { translate } from '../../base/i18n';
import { IconVirtualBackground } from '../../base/icons';
import { connect } from '../../base/redux';
import { AbstractButton } from '../../base/toolbox/components';
import type { AbstractButtonProps } from '../../base/toolbox/components';
import { getLocalVideoTrack } from '../../base/tracks';
import { toggleVideoAvatarEffect } from '../actions';
declare var APP: Object;

// import { VirtualBackgroundDialog } from './index';

/**
 * The type of the React {@code Component} props of {@link VideoBackgroundButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * True if the video background is blurred or false if it is not.
     */
    _isBackgroundEnabled: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * An abstract implementation of a button that toggles the video background dialog.
 */
class VideoAvatarButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.selectAvatar';
    icon = IconVirtualBackground;
    label = 'toolbar.selectAvatar';
    tooltip = 'toolbar.selectAvatar';

    /**
     * Handles clicking / pressing the button, and toggles the virtual background dialog
     * state accordingly.
     *
     * @protected
     * @returns {void}
     */
    async _handleClick() {
        const { dispatch } = this.props;

        console.log('HELLLLOOO');
        const jitsiTrack = getLocalVideoTrack(APP.store.getState()['features/base/tracks'])?.jitsiTrack;

        console.log('JITSI TRACK', jitsiTrack);

        dispatch(toggleVideoAvatarEffect({ enabled: true }, jitsiTrack));
    }

    /**
     * Returns {@code boolean} value indicating if the background effect is
     * enabled or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._isBackgroundEnabled;
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code VideoBackgroundButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _isBackgroundEnabled: boolean
 * }}
 */
function _mapStateToProps(state): Object {

    return {
        _isBackgroundEnabled: Boolean(state['features/virtual-background'].backgroundEffectEnabled)
    };
}

export default translate(connect(_mapStateToProps)(VideoAvatarButton));
