import React from 'react';
import { string, shape, number, bool } from 'prop-types';

import './Home.css';

import { Panel } from '@vkontakte/vkui';
import Level from 'components/Level';

const Home = ({ id, user }) => {
    return (
        <Panel id={id} className="Home">
            {(user) && <> 
                <Level
                    className="Home__Level"
                    progress={75}
                    avatar={user.avatar_200}
                    title="Не, ну ты прям пидор..."
                    subtitle="К тебе часто парни подкатывают?" />
            </>}
        </Panel>
    );
};

Home.propTypes = {
    id: string.isRequired,
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
};

export default Home;