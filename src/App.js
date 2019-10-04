import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';

import { View, ScreenSpinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from 'panels/Home';

import { getTimezoneOffset, parseQueryString } from 'helpers';
import { auth } from 'api';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [popout, setPopout] = useState(<ScreenSpinner size="large" />);

	const [user, setUser] = useState(null);

	/**
	 * Авторизация
	 */
	useEffect(() => {
		window.axios = window.axios.create({
			baseURL: process.env.REACT_APP_API_URL,
			headers: {
				'Vk-Params': window.btoa(JSON.stringify({
					...parseQueryString(window.location.search),
					'utc_offset': getTimezoneOffset(),
				})),
				'Accept': 'application/json'
			},
		});

		function authorization() {
			auth()
				.then(({ data }) => {
					setUser(data);
					setPopout(null);
				})
				.catch(() => console.log('auth'));
		}

		authorization();
	}, []);

	/**
	 * Подписка на события vk connect
	 */
	useEffect(() => {
		connect.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
	}, []);

	/**
	 * Организация переходов по панелям
	 */
	function changeActivePanel(e) {
		if (e.state) {
			setActivePanel(e.state.panel);
		} else {
			setActivePanel('home')
			window.history.pushState({ panel: 'home' }, 'home');
		}
	}

	function go(e) {
		setActivePanel(e.currentTarget.dataset.to)
		window.history.pushState({ panel: e.currentTarget.dataset.to }, e.currentTarget.dataset.to);
	}

	function goBack() {
		window.history.back();
	}

	useEffect(() => {
		window.addEventListener('popstate', (e) => {
			e.preventDefault();
			changeActivePanel(e);
		});

		window.history.pushState({ panel: activePanel }, activePanel);
	}, []);

	return (
		<View activePanel={activePanel} popout={popout}>
			<Home id="home" user={user} go={go} />
		</View>
	);
}

export default App;

