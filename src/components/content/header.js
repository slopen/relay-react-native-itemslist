import React, {Component} from 'react';
import Relay from 'react-relay';

import browserHistory from 'react-router/lib/browserHistory';
import Link from 'react-router/lib/Link';

import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Navbar from 'react-bootstrap/lib/Navbar';


const logo = require ('../../img/logo.jpeg');

class Header extends Component {

	navigate (e) {
		const href = e.target.getAttribute ('href');

		browserHistory.push (href);
		e.preventDefault ();
	}

	render () {
		const {viewer} = this.props;
		const {total: totalItems} = viewer.items;
		const {total: totalTags} = viewer.tags;

		return (
			<Navbar>
				<Navbar.Header>
					<Navbar.Brand>
						<Link to={'/'}>
							<span className="logo">
								<img src={logo}/>
							</span>
							<span className="hidden-xs">
								Relay Items List
							</span>
						</Link>
					</Navbar.Brand>
				</Navbar.Header>

				<Nav pullRight>
					<NavItem
						eventKey={1}
						href="/item"
						onClick={this.navigate}>
						{totalItems} item{totalItems !== 1 ? 's' : ''}
					</NavItem>

					<NavItem
						eventKey={2}
						href="/tag"
						onClick={this.navigate}>
						{totalTags} tag{totalTags !== 1 ? 's' : ''}
					</NavItem>
				</Nav>
		</Navbar>
		);
	}
}

export default Relay.createContainer (Header, {

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {
				items (first: 1) {
					total
				}
				tags (first: 1) {
					total
				}
			}
		`
	}
});