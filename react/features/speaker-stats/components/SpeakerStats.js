// @flow

import React, { Component } from 'react';

import { Dialog } from '../../base/dialog';
import { translate } from '../../base/i18n';
import { getLocalParticipant } from '../../base/participants';
import { connect } from '../../base/redux';
import { getCameraTime } from '../../facial-recognition/functions';

import SpeakerStatsItem from './SpeakerStatsItem';
import SpeakerStatsLabels from './SpeakerStatsLabels';

declare var interfaceConfig: Object;

/**
 * The type of the React {@code Component} props of {@link SpeakerStats}.
 */
type Props = {

    /**
     * The display name for the local participant obtained from the redux store.
     */
    _localDisplayName: string,

    _localFacialExpressions: Array<Object>,

    _localCameraTimeTracker: Object,

    _reduceExpressions: boolean,

    /**
     * The JitsiConference from which stats will be pulled.
     */
    conference: Object,

    /**
     * The function to translate human-readable text.
     */
    t: Function
};

/**
 * The type of the React {@code Component} state of {@link SpeakerStats}.
 */
type State = {

    /**
     * The stats summary provided by the JitsiConference.
     */
    stats: Object
};

/**
 * React component for displaying a list of speaker stats.
 *
 * @extends Component
 */
class SpeakerStats extends Component<Props, State> {
    _updateInterval: IntervalID;

    /**
     * Initializes a new SpeakerStats instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this.state = {
            stats: this.props.conference.getSpeakerStats()
        };

        // Bind event handlers so they are only bound once per instance.
        this._updateStats = this._updateStats.bind(this);
    }

    /**
     * Begin polling for speaker stats updates.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._updateInterval = setInterval(this._updateStats, 1000);
    }

    /**
     * Stop polling for speaker stats updates.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        clearInterval(this._updateInterval);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const userIds = Object.keys(this.state.stats);
        const items = userIds.map(userId => this._createStatsItem(userId));

        return (
            <Dialog
                cancelKey = { 'dialog.close' }
                submitDisabled = { true }
                titleKey = 'speakerStats.speakerStats'
                width = 'large'>
                <div className = 'speaker-stats'>
                    <SpeakerStatsLabels reduceExpressions = { this.props._reduceExpressions } />
                    { items }
                </div>
            </Dialog>
        );
    }

    /**
     * Create a SpeakerStatsItem instance for the passed in user id.
     *
     * @param {string} userId -  User id used to look up the associated
     * speaker stats from the jitsi library.
     * @returns {SpeakerStatsItem|null}
     * @private
     */
    _createStatsItem(userId) {
        const statsModel = this.state.stats[userId];

        if (!statsModel) {
            return null;
        }

        const isDominantSpeaker = statsModel.isDominantSpeaker();
        const dominantSpeakerTime = statsModel.getTotalDominantSpeakerTime();
        const hasLeft = statsModel.hasLeft();

        let displayName;
        let facialExpressions;
        let cameraTime;

        if (statsModel.isLocalStats()) {
            const { t } = this.props;
            const meString = t('me');

            displayName = this.props._localDisplayName;
            displayName
                = displayName ? `${displayName} (${meString})` : meString;

            facialExpressions = this.props._localFacialExpressions;
            cameraTime = getCameraTime(this.props._localCameraTimeTracker);
        } else {
            displayName
                = this.state.stats[userId].getDisplayName()
                    || interfaceConfig.DEFAULT_REMOTE_DISPLAY_NAME;

            facialExpressions = this.state.stats[userId].getFacialExpressions();
            // eslint-disable-next-line max-len
            cameraTime = this.state.stats[userId].getCameraTimeTracker() && getCameraTime(this.state.stats[userId].getCameraTimeTracker());
        }

        return (
            <SpeakerStatsItem
                cameraTime = { cameraTime }
                displayName = { displayName }
                dominantSpeakerTime = { dominantSpeakerTime }
                facialExpressions = { facialExpressions }
                hasLeft = { hasLeft }
                isDominantSpeaker = { isDominantSpeaker }
                key = { userId }
                reduceExpressions = { this.props._reduceExpressions } />
        );
    }

    _updateStats: () => void;

    /**
     * Update the internal state with the latest speaker stats.
     *
     * @returns {void}
     * @private
     */
    _updateStats() {
        const stats = this.props.conference.getSpeakerStats();

        console.log(stats);

        this.setState({ stats });
    }
}

/**
 * Maps (parts of) the redux state to the associated SpeakerStats's props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {{
 *     _localDisplayName: ?string
 * }}
 */
function _mapStateToProps(state) {
    const localParticipant = getLocalParticipant(state);
    const { facialExpressions: localFacialExpressions } = state['features/facial-recognition'];
    const { cameraTimeTracker: localCameraTimeTracker } = state['features/facial-recognition'];
    const { clientWidth } = state['features/base/responsive-ui'];

    return {
        /**
         * The local display name.
         *
         * @private
         * @type {string|undefined}
         */
        _localDisplayName: localParticipant && localParticipant.name,
        _localFacialExpressions: localFacialExpressions,
        _localCameraTimeTracker: localCameraTimeTracker,
        _reduceExpressions: clientWidth < 750
    };
}

export default translate(connect(_mapStateToProps)(SpeakerStats));
