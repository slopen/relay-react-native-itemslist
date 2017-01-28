import {Component} from 'react';

const limit = 10;

export default class List extends Component {

    constructor (props) {
        super (props);

        this.state = {};
    }

    static limit = limit

    getItems () {
        return {edges: []};
    }

    requestNext = (e) => {
        const {edges} = this.getItems ();

        this.setState ({
            loading: true
        });

        this.props.relay.setVariables ({
            first: edges.length + limit
        }, ({done}) => done && this.setState ({
            loading: false
        }));
    }

    onScroll = (e) => {
        if (this.state.loading) {
            return;
        }

        const {
            contentSize,
            contentInset,
            contentOffset,
            layoutMeasurement,
        } = e.nativeEvent;

        const distance = contentSize.height +
            contentInset.bottom - contentOffset.y -
            layoutMeasurement.height;

        const {pageInfo} = this.getItems ();

        if (pageInfo.hasNextPage && distance <  100) {
            this.requestNext ();
        }
    }
}
