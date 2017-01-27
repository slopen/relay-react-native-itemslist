import Relay from 'react-relay';
import RelayStore from './lib/relay-store';

import NetworkLayer from './network';

RelayStore.reset (NetworkLayer);

export default RelayStore