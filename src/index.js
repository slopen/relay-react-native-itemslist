import React from 'react';

import {
  Router,
  nativeHistory
} from 'react-router-native';

import routes from './components/routes';


export default () =>
	<Router history={nativeHistory}>
		{routes}
	</Router>