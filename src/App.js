import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';

import { View, ScreenSpinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from 'panels/Home';
import Preview from 'panels/Preview';
import NotificationContainer from 'components/NotificationContainer';
import Notification from 'components/Notification';

import { getTimezoneOffset, parseQueryString } from 'helpers';
import { auth, friends, pidorOfTheDay, postStory, prepareStory, givePidorRate } from 'api';
import * as VK from 'constants/vk';

import './App.css';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [loaded, setLoaded] = useState(false);
	const [popout, setPopout] = useState(<ScreenSpinner size="large" />);

	const [user, setUser] = useState(null);
	const [pidorDay, setPidorDay] = useState(null);
	const [friendsList, setFriendsList] = useState(undefined);
	const [notifications, setNotifications] = useState([]);

	const [preview, setPreview] = useState(null);
	const [disabledPostStory, setDisabledPostStory] = useState(false);

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
		let to = e;
		if (typeof e === 'object') {
			to = e.currentTarget.dataset.to;
		}

		setActivePanel(to);
		window.history.pushState({ panel: to }, `${to}`);
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
		// eslint-disable-next-line react-hooks/exhaustive-deps		
	}, []);

	/**
	 * Уведомления
	 */
	function addNotification(title, subtitle, duration = 0) {
		setTimeout(() => {
			const index = notifications.length;
			const nextNotifications = [...notifications].concat({ title, subtitle });
			
			setNotifications(nextNotifications);
			removeNotification(index);
		}, duration);
	}

	function removeNotification(index, duration = 4000) {
		setTimeout(() => {
			const nextNotifications = notifications.filter(filterNotification, index);
			setNotifications(nextNotifications);
		}, duration);
	}

	function filterNotification(_, index) {
		return index !== this;
	}

	function renderNotification(notification, index) {
		return <Notification key={index} {...notification} />;
	}

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

		function authorization(callback = f => f) {
			auth()
				.then(({ data }) => {
					setUser(data);
					callback();
				})
				.catch(() => console.log('auth'));
		}

		function fetchFriends(callback = f => f) {
			return friends()
				.then(({ data }) => {
					setFriendsList(data);
				})
				.catch(({ response: { status } }) => {
					// закрытый профиль
					if (status === 403) {
						addNotification(
							'Твой профиль закрыт',
							'Мы не можем показать тебе, кто из твоих друзей пидор :(',
							5000
						);
					}
				})
				.then(callback, callback);
		}

		function fetchPidorOfTheDay(callback = f => f) {
			return pidorOfTheDay()
				.then(({ data }) => {
					setPidorDay(data);
				})
				.catch(() => console.log('fetch pidor'))
				.then(callback, callback);
		}

		function fetchAll() {
			Promise.all([fetchFriends(), fetchPidorOfTheDay()]).then(
				removePopout,
				() => console.log('err')
			)
		}

		function removePopout() {
			setPopout(null);
			setLoaded(true);
		}

		authorization(fetchAll);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Получение превью сторис
	 */
	function getPreviewStory(e) {
		const to = e.currentTarget.dataset.to;

		setPopout(<ScreenSpinner size="large" />);

		prepareStory()
			.then(({ rest }) => {
				setPreview(rest.request.response);
				setPopout(null);
				go(to);
			})
			.catch((err) => {
				addNotification(
					'Ой...',
					'Мы не смогли показать тебе превью твоего призания. Может, попробуешь еще?'
				);
				setPopout(null);
				console.log(err);
			});
	}

	/**
	 * Постинг сторис
	 */
	function startPostingStory() {
		addNotification(
			'Начинаем постить твою историю',
			'Погоди-ка чутка...',
			0
		);
	}

	function successPostedStory() {
		addNotification('Ура!', 'Ну ты не пидор', 500);
		enablePostStoryButton();
	}

	function failPostedStory() {
		addNotification(
			'Что-то пошло не так',
			'Не получилось у нас опубликовать твою историю',
			500
		);
		enablePostStoryButton();
	}

	function failGetPhotoUploadServer() {
		addNotification(
			'У нас не получилось запостить',
			'Тогда так и оставайся пидором',
			1000
		);
		enablePostStoryButton();
	}

	function deniedPostStory() {
		addNotification(
			'Не хочешь постить историю?',
			'Тогда так и оставайся пидором',
			500
		);
		enablePostStoryButton();
	}

	function disablePostStoryButton() {
		setDisabledPostStory(true);
	}

	function enablePostStoryButton() {
		setDisabledPostStory(false);
	}

	function postingStory() {
		disablePostStoryButton();

		connect.sendPromise('VKWebAppGetAuthToken', { app_id: VK.APP_ID, scope: 'stories' })
			.then(({ access_token }) => {
				connect.sendPromise('VKWebAppCallAPIMethod', {
					method: 'stories.getPhotoUploadServer',
					params: {
						access_token,
						add_to_news: 1,
						user_ids: [user.vk_user_id],
						link_text: 'open',
						link_url: 'https://vk.com/app' + VK.APP_ID,
						v: VK.API_VERSION
					}
				})
					.then(({ response }) => {
						startPostingStory();

						const uploadUrl = response.upload_url;

						postStory(uploadUrl)
							.then(({ status, data }) => {
								if (status === 200) {
									successPostedStory();
									setUser(data);
									
									if (activePanel !== 'home') {
										setTimeout(goBack, 1000);
									}
								}
							})
							.catch(failPostedStory);
					})
					.catch(failGetPhotoUploadServer);
			})
			.catch(deniedPostStory);
	}

	/**
	 * Увеличить pidor_rate другу
	 */
	function givePidorRateFriend(friend) {
		if (friend && friend.hasOwnProperty('id')) {
			givePidorRate(friend.id)
				.then(() => {
					addNotification('Красава', '...');
					const nextFriendsList = [...friendsList].map(friendsListCallback, friend);
					setFriendsList(nextFriendsList);
				})
				.catch((e) => {
					if (e.response.status === 403) {
						addNotification('Может хватит?', 'Ты уже закинул ему 10%');
					}

					return e;
				})
				.catch((e) => console.log('give pidor', e));
		}
	}

	function friendsListCallback(friend) {
		if (this.id === friend.id) {
			const nextPidorRate = friend.pidor_rate + 10;

			return {
				...friend,
				pidor_rate: (nextPidorRate > 100) ? 100 : nextPidorRate
			};
		}

		return friend;
	}

	return <>
		<NotificationContainer children={notifications.map(renderNotification)} />

		<View activePanel={activePanel} popout={popout}>
			<Home
				id="home"
				loading={loaded}
				user={user}
				pidorDay={pidorDay}
				friends={friendsList}
				notifications={notifications}
				getPreviewStory={getPreviewStory}
				disabledPostStory={disabledPostStory}
				givePidorRateFriend={givePidorRateFriend}
				go={go} />
			<Preview
				id="preview"
				preview={preview}
				disabledPostStory={disabledPostStory}
				postingStory={postingStory}
				goBack={goBack} />
		</View>
	</>;
}

export default App;

