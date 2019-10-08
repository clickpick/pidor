import React from 'react';
import { string, func, bool } from 'prop-types';

import './Preview.css';

import { Panel, PanelHeader, HeaderButton, platform, IOS } from '@vkontakte/vkui';
import Button from 'components/Button';

import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

const osname = platform();

const Preview = ({ id, preview, postingStory, disabledPostStory, goBack }) => {
    const headerButtonChildren = (osname === IOS) ? <Icon28ChevronBack /> : <Icon24Back />;

    return (
        <Panel id={id} className="Preview">
            <PanelHeader
                left={<HeaderButton children={headerButtonChildren} onClick={goBack} />}
                children="Предпросмотр" />

            <div className="Preview__wrapper">
                <img className="Preview__story" src={preview} alt="История" />
                <Button
                    className="Preview__Button"
                    size="medium"
                    theme="primary"
                    children="Опубиликовать историю"
                    full
                    onClick={postingStory}
                    disabled={disabledPostStory} />
            </div>
        </Panel>
    );
};

Preview.propTypes = {
    id: string.isRequired,
    preview: string,
    postingStory: func,
    disabledPostStory: bool,
    goBack: func,
};

export default Preview;