import {
    RelayNetworkLayer,
    urlMiddleware
} from 'react-relay-network-layer';

import config from './config';

const {url, batchUrl} = config.network;

export default new RelayNetworkLayer ([

    urlMiddleware ({url, batchUrl}),

    (next) => (req) => {
        req.credentials = 'same-origin';

        return next (req);
    }
])