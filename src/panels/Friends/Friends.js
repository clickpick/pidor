import React from 'react';
import { string, func } from 'prop-types';

import {
    Panel, PanelHeader, HeaderButton,
    platform, IOS
} from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

const osName = platform();

const Friends = ({ id, goBack }) => {

    return (
        <Panel id={id} className="Friends">
            <PanelHeader
                left={
                    <HeaderButton
                        children={(osName === IOS) ? <Icon28ChevronBack /> : <Icon24Back />}
                        onClick={goBack} />}
                children="Friends" />
        </Panel>
    );
};

Friends.propTypes = {
    id: string.isRequired,
    goBack: func.isRequired,
};

export default Friends;

