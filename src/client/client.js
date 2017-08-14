import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom'
import root from './root.js'
import {Provider} from 'react-redux'
import {configureStore} from '../redux/store'
import {Router, browserHistory, Route} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
const initialState = window.__PRELOADED_STATE__;
injectTapEventPlugin();
const store = configureStore(initialState);

ReactDOM.render(
	<Provider store={store}>
		<MuiThemeProvider>
	    <Router history={browserHistory} routes={root} />
		</MuiThemeProvider>
	</Provider>
,document.getElementById('app')
)
