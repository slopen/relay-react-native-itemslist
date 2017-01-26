import {Component} from 'react';

const limit = 5;

export default class List extends Component {

    requestNext = (e) => {
        const {length} = this.getEdges ();

        this.props.relay.setVariables ({
            first: length + limit
        });

        e.preventDefault();
    }
}
