import React from 'react';
import { string, shape, number, bool, arrayOf, object, func } from 'prop-types';

import './Home.css';

import { Panel } from '@vkontakte/vkui';
import NotificationContainer from 'components/NotificationContainer';
import Notification from 'components/Notification';
import Level from 'components/Level';
import PidorDay from 'components/PidorDay';
import Button from 'components/Button';
import FriendsList from 'components/FriendsList';

const Home = ({ id, loading, user, pidorDay, friends, notifications, postingStory, disabledPostStory }) => {
    function renderNotification(notification, index) {
        return <Notification key={index} {...notification} />;
    }

    return (
        <Panel id={id} className="Home">
            <NotificationContainer children={notifications.map(renderNotification)} />

            {(loading) && <> 
                <Level
                    className="Home__Level"
                    progress={user.pidor_rate}
                    avatar={user.avatar_200}
                    gif={user.gif}
                    title={user.phrase.title}
                    subtitle={user.phrase.subtitle} />

                <div className="Home__actions">
                    <div className="Home__action">
                        <Button
                            className="Home__Button"
                            size="medium"
                            children="Убрать 20%"
                            full
                            onClick={postingStory}
                            disabled={disabledPostStory} />
                        <p className="Home__hint" children="Cторис с признанием" />
                    </div>
                    <div className="Home__action">
                        <Button
                            className="Home__Button"
                            size="medium"
                            children="Убрать до 0%"
                            full />
                        <p className="Home__hint" children="Плоти и никто не узнает" />
                    </div>
                </div>

                {(pidorDay) && <PidorDay className="Home__PidorDay" user={pidorDay} />}

                {(Array.isArray(friends) && friends.length > 0) &&
                    <FriendsList className="Home__FriendsList" data={friends} />}
            </>}
        </Panel>
    );
};

Home.propTypes = {
    id: string.isRequired,
    loading: bool,
    user: shape({
        vk_user_id: number,
        first_name: string,
        last_name: string,
        avatar_200: string,
        utc_offset: number,
        messages_are_enabled: bool,
        notifications_are_enabled: bool,
        is_pidor: bool,
        pidor_rate: number
    }),
    pidorDay: shape({
        vk_user_id: number,
        first_name: string,
        last_name: string,
        avatar_200: string,
        utc_offset: number,
        messages_are_enabled: bool,
        notifications_are_enabled: bool,
        is_pidor: bool,
        pidor_rate: number
    }),
    friends: arrayOf(object),
    notifications: arrayOf(object),
    postingStory: func,
    disabledPostStory: bool
};

export default Home;