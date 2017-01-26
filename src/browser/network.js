import {
    RelayNetworkLayer,
    urlMiddleware
} from 'react-relay-network-layer';


export default new RelayNetworkLayer ([
    urlMiddleware ({
        url: '//localhost:9000/graphql',
        batchUrl: '//localhost:9000/batch'
    }),

    (next) => (req) => {
        req.credentials = 'same-origin';

        return next (req);
    }
])