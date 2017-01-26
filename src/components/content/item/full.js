import React, {Component} from 'react'
import Relay from 'react-relay';

import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';

import Tag from '../tag/linked';
import UpdateItemMutation from '../../../mutations/item/update';
import LinkMutation from '../../../mutations/link';

const limit = 20;

const AddTagControl = ({tags, selected, onSelect}) => {
	const availableTags = tags.edges.filter (
		({node: tag}) => !selected.edges.find (
			({node}) => node.id === tag.id
		)
	);

	return (
		<DropdownButton
			pullRight
			title="Tag"
			id="add-tag"
			bsSize="large"
			onSelect={onSelect}>

			{availableTags.map (({node}) => (
				<MenuItem key={node.id} eventKey={node.id}>
					{node.name}
				</MenuItem>
			))}
		</DropdownButton>
	);

}

class Item extends Component {

	constructor (props) {
		const {name, content, tags} = props.viewer.item;

		super (props);

		this.state = {name, content, tags};
	}

	onChange = (e) => {
		const {name, value} = e.target;

		this.setState ({[name]: value});
	}

	onTagAdd = (id, e) => {
		const {item, tags} = this.props.viewer;
		const {node} = tags.edges.find (
			({node}) => node.id === id
		);

		Relay.Store.commitUpdate (
			new LinkMutation ({
				tag: node,
				item: item
			})
		);

		e.preventDefault ();
	}

	onSave = (e) => {
		const {item} = this.props.viewer;
		const {name, content} = this.state;

		Relay.Store.commitUpdate (
			new UpdateItemMutation ({item, name, content})
		);

		e.preventDefault ();
	}

	render () {
		const {item, tags} = this.props.viewer;
		const {tags: itemTags} = item;

		const {content, name} = this.state;

		return (
			<form className="item form">

				<h1>{item.name}</h1>

				<hr/>

				<FormGroup controlId="item-name">
					<FormControl
						type="text"
						name="name"
						value={name}
						onChange={this.onChange}
						placeholder="item name"/>
				</FormGroup>

				<FormGroup controlId="item-content">
					<FormControl
						rows={4}
						name="content"
						value={content}
						onChange={this.onChange}
						componentClass="textarea"
						placeholder="item content"/>
				</FormGroup>

				<div className="clearfix">
					<div className="pull-right">
						<AddTagControl
							tags={tags}
							selected={itemTags}
							onSelect={this.onTagAdd}/>
					</div>

					<ul className="items-list list-inline">
						{itemTags.edges.map (({node}) => (
							<li key={node.id}>
								<Tag tag={node} item={item}/>
							</li>
						))}
					</ul>
				</div>

				<hr/>

				<Button
					bsSize="large"
					className="btn-default"
					onClick={this.onSave}>SAVE</Button>
			</form>
		);
	}

}

export default Relay.createContainer(Item, {

	initialVariables: {
		id: null,
		limit: limit
	},

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {
				item (id: $id) {
					id,
					name,
					content,

					tags (first: $limit){
						edges {
							node {
								id,
								${Tag.getFragment ('tag')}
							}
						}
					}

					${UpdateItemMutation.getFragment ('item')}
				}

				tags (first: 20) {
					edges {
						node {
							id
							name
						}
					}
				}
			}
		`
	}
});