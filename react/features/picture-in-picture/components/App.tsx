import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Content from './Content';
import ToolBox from './Toolbox';

const style: any = {
    width: '100%',
    height: '100%'
};

const App = () => (
    <div
        style = { style }>
        <Content />
        <ToolBox />
    </div>
);

const renderApp = (element: HTMLElement) => {
    ReactDOM.render(

        // @ts-ignore
        <Provider store = { APP.store }>
            <App />
        </Provider>, element);
};

export default renderApp;
