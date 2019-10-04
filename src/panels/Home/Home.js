import React from 'react';
import { string, shape, number, bool } from 'prop-types';

import { Panel, PanelHeader, Div, Avatar, Button } from '@vkontakte/vkui';

import './Home.css';

const Home = ({ id, user }) => {
    return (
        <Panel id={id} className="Home">
            <PanelHeader>{(user) ? 'Пидор дня' : 'Погоди...'}</PanelHeader>

            {(user) && <> 
                <Div>
                    <Avatar src={user.avatar_200} size={80} /> 
                    {(user.is_pidor) ? 'Ты пидор' : 'Сегодня ты не пидор'}
                </Div>
                <Div>
                    <Button className="Home__Button" size="xl" level="secondary">Найти пидора в друзей</Button>
                    <Button className="Home__Button" size="xl" level="secondary">Топ пидоров</Button>
                    <Button className="Home__Button" size="xl" level="primary">Не хочу быть пидором</Button>
                </Div>
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
    })
};

export default Home;