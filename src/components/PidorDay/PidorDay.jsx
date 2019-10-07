import React from 'react';
import { string, number, shape } from 'prop-types';
import classNames from 'classnames';

import './PidorDay.css';

import Button from 'components/Button';

import { DONATE_LINK } from 'constants/vk';

const PidorDay = ({ className, user, ...restProps }) => {
    const name = `${user.first_name} ${user.last_name}`;

    return (
        <div className={classNames(className, 'PidorDay')} {...restProps}>
            <a
                className="PidorDay__link"
                href={`https://vk.com/id${user.vk_user_id}`}
                target="_blank"
                rel="noopener noreferrer">
                <div className="PidorDay__avatar">
                    <img src={user.avatar_200} alt={name} />
                </div>
                <h2 className="PidorDay__name" children={name} />
                <p className="PidorDay__status" children="Пидор дня" />
            </a>

            <Button
                href={DONATE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                size="medium"
                full
                children="Стать пидором дня" />
        </div>
    );
};

PidorDay.propTypes = {
    className: string,
    user: shape({
        vk_user_id: number,
        avatar_200: string,
    })
};

export default PidorDay;