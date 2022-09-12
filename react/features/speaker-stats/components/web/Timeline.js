/* eslint-disable */
import React from 'react';
import { useSelector } from 'react-redux';
import { VictoryAxis, VictoryChart, VictoryZoomContainer, VictoryScatter, VictoryTooltip } from 'victory';
const stc = require('string-to-color');
const chartTheme = {
    axis: {
        style: {
            axis: {
                stroke: 'white' // CHANGE COLOR OF X-AXIS
            },
            tickLabels: {
                // this changed the color of my numbers to white
                fill: 'white'
            },

            grid: {
                fill: 'none',
                stroke: 'none',
                pointerEvents: 'painted'
            }
        }
    }
};

const FACE_EXPRESSIONS_NUMBERS = {
    happy: 6,
    neutral: 5,
    sad: 4,
    surprised: 3,
    angry: 2,
    fearful: 1,
    disgusted: 0,
    
};

const NUMBERS = {
    6: 'happy',
    5: 'neutral',
    4: 'sad',
    3: 'surprised',
    2: 'angry',
    1: 'fearful',
    0: 'disgusted'
}


function hashCode(str) { // java String#hashCode
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return hash;
}

function intToRGB(i) {
    const c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return '00000'.substring(0, 6 - c.length) + c;
}

const Timeline = () => {
    const { stats } = useSelector(state => state['features/speaker-stats']) || {};

    // console.log(stats);

    const points = Object.keys(stats).map(id => (<VictoryScatter
        data = { stats[id].timeline.map(e => {return {x: e.x, y: FACE_EXPRESSIONS_NUMBERS[e.y]}}) }
        key = { id }
        labelComponent = {
            <VictoryTooltip
                constrainToVisibleArea = { true }
                dy = { -7 } />
        }
        // eslint-disable-next-line react/jsx-no-bind
        labels = { () => stats[id].getDisplayName() }
        style = {{
            data: { fill: stc(stats[id].getDisplayName()) },
            labels: { fill: stc(stats[id].getDisplayName()) }

        }} />));

    return (
        <VictoryChart
            domainPadding={{ y: 10, x: 10 }}
            containerComponent = {
                <VictoryZoomContainer
                    zoomDimension = 'x' />
            }
            domain = {{y: [0, 6]}}
            theme = { chartTheme } >
            <VictoryAxis
                dependentAxis = { true }
                tickFormat = { t => {
                    const no = Math.round(t);

                    return NUMBERS[no];
                } }
                style = {{
                    grid: { stroke: 'white',
                        strokeWidth: 0.5 }
                }} />
            <VictoryAxis
                tickFormat = { t => {
                    const date = new Date(t);

                    return `${date.getMinutes()}:${date.getSeconds()}`;
                } } />
            {points}
        </VictoryChart>
    );
};

export default Timeline;
