import { connect } from 'react-redux';

import { IReduxState } from '../../app/types';
import { translate } from '../../base/i18n/functions';
import { IconPictureInPicture } from '../../base/icons/svg';
import AbstractButton, { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
import { togglePictureInPicture } from '../actions';

interface IProps extends AbstractButtonProps {

    /**
     * Whether or not the button is toggled.
     */
    _toggled: boolean;
}

/**
 * Component that renders a toolbar button for the pictureInPicture.
 */
class PictureInPictureButton extends AbstractButton<IProps> {
    accessibilityLabel = 'toolbar.accessibilityLabel.openPictureInPicture';
    toggledAccessibilityLabel = 'toolbar.accessibilityLabel.closePictureInPicture';
    icon = IconPictureInPicture;
    label = 'toolbar.pictureInPicture';
    toggledLabel = 'toolbar.openPictureInPicture.';
    toggledTooltip = 'toolbar.closePictureInPicture';
    tooltip = 'toolbar.pictureInPicture';

    /**
     * Handles clicking / pressing the button, and opens / closes the whiteboard view.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;

        dispatch(togglePictureInPicture());
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._toggled;
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state: IReduxState) {
    return {
        _toggled: state['features/picture-in-picture'].isOpen ?? false,
        visible: true
    };
}

export default translate(connect(_mapStateToProps)(PictureInPictureButton));
