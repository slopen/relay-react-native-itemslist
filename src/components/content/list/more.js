import React from 'react';

import Button from 'react-bootstrap/lib/Button';

export default ({pageInfo, next}) => {
	const {hasNextPage} = pageInfo;

	return (
		<div className="list-inline pull-right">
			<Button
				bsSize="large"
				className="btn-default"
				disabled={!hasNextPage}
				onClick={next}>MORE</Button>
		</div>
	);
}