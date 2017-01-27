import React from 'react';
import Relay from 'react-relay';

import {
    Header,
    Route,
    Router,
    StackRoute,
    IndexRoute,
    withRouter
} from 'react-router-native';

import {
    View,
    StyleSheet
} from 'react-native';

import AppHeader from '../content/header';

import ItemsList from '../content/item/list';
import Item from '../content/item/full';

import Tag from '../content/tag/full';
import TagsList from '../content/tag/list';

import ViewerQuery from '../../queries/viewer-query';

const styles = StyleSheet.create ({
    component: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    }
});


const Master = (props) => (
    <View style={styles.component}>
        {props.children}
    </View>
);


export default (
    <StackRoute
        path="master"
        component={Master}>

        <Route
            path="/"
            component={ItemsList}
            overlayComponent={AppHeader}/>

        <Route
            path="/item/:id"
            component={Item}
            overlayComponent={AppHeader}/>

        <Route
            path="/items"
            component={ItemsList}
            overlayComponent={AppHeader}/>


        <Route
            path="/tag/:id"
            component={Tag}
            overlayComponent={AppHeader}/>

        <Route
            path="/tags"
            component={TagsList}
            overlayComponent={AppHeader}/>

    </StackRoute>
);