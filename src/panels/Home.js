import React, { useState, useEffect } from 'react';
import { string } from 'prop-types';
import { Panel, PanelHeader, Button, Group, Div } from '@vkontakte/vkui';

const Home = ({ id }) => {
	const [count, setCount] = useState(0);
	
	useEffect(() => {
		document.title = `Click count: ${count}`;
	});

	function handleClick() {
		setCount(count + 1);
	}

	return (
		<Panel id={id}>
			<PanelHeader>Example</PanelHeader>

			<Group title="Navigation Example">
				<Div>
					<Button size="xl" level="2" onClick={handleClick}>
						Click me pleeeease
				</Button>
				</Div>
			</Group>
		</Panel>
	);
};

Home.propTypes = {
	id: string.isRequired,
};

export default Home;
