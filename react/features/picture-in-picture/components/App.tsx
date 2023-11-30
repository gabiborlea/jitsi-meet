import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import GlobalStyles from '../../base/ui/components/GlobalStyles.web';
import JitsiThemeProvider from '../../base/ui/components/JitsiThemeProvider.web';
import Toolbox from '../../toolbox/components/web/Toolbox';

import Content from './Content';

const style: any = {
    width: '100%',
    height: '100%'
};

const App = () => (
    <JitsiThemeProvider>
        <GlobalStyles />
        <div
            id = 'picture-in-picture-window'
            style = { style }>
            <Content />
            <Toolbox toolbarButtons = { [ 'camera', 'microphone', 'hangup' ] } />
        </div>
    </JitsiThemeProvider>
);

const renderApp = (element: HTMLElement) => {
    ReactDOM.render(

        // @ts-ignore
        <Provider store = { APP.store }>
            <App />
        </Provider>, element);
};

export default renderApp;
