import React from 'react';
import Relay from 'react-relay';
import {Route, IndexRoute} from 'react-router-native';

import App from '../app';
// import Item from '../content/item/full';
// import ItemsList from '../content/item/list';
// import Tag from '../content/tag/full';
// import TagsList from '../content/tag/list';


const viewerQueries = {
    viewer: () => Relay.QL`
        query {
            viewer
        }
    `
};

export default (
    <Route
        path="/"
        component={App}
        queries={viewerQueries}>

    </Route>
);
        // <IndexRoute
        //     component={ItemsList}
        //     queries={viewerQueries}/>

        // <Route
        //     path="item"
        //     component={ItemsList}
        //     queries={viewerQueries}>
        // </Route>

        // <Route
        //     path="item/:id"
        //     component={Item}
        //     queries={viewerQueries}/>

        // <Route
        //     path="tag"
        //     component={TagsList}
        //     queries={viewerQueries}/>

        // <Route
        //     path="tag/:id"
        //     component={Tag}
        //     queries={viewerQueries}/>