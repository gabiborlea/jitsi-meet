// @flow

import { Checkbox } from '@atlaskit/checkbox';
import React from 'react';

import { connect } from '../../../base/redux';
import { setSendTextToSpeech as setSendTextToSpeechMessage } from '../../actions';

type Props = {
    sendTextToSpeechMessage: boolean,
    setSendTextToSpeech: Function
}

/**
 * @param  {Props} props
 */
function TextToSpeechCheckbox({ sendTextToSpeechMessage, setSendTextToSpeech }: Props) {
    /**
     * @param  {{checked}}}- -  {target.
     */
    const _onChangeTextToSpeech = React.useCallback(({ target: { checked } }) => {
        setSendTextToSpeech(checked);
    }, [ sendTextToSpeechMessage ]);

    return (
        <Checkbox
            isChecked = { sendTextToSpeechMessage }
            label = { 'Send text to speech message' }
            name = { 'send-text-to-speech' }
            onChange = { _onChangeTextToSpeech } />
    );
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code SecurityDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function mapStateToProps(state) {
    const { sendTextToSpeechMessage } = state['features/chat'];

    return {
        sendTextToSpeechMessage
    };
}

const mapDispatchToProps = { setSendTextToSpeech: setSendTextToSpeechMessage };

export default connect(mapStateToProps, mapDispatchToProps)(TextToSpeechCheckbox);
