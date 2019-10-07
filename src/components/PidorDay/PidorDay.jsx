import React from 'react';
import { string, number, shape, func } from 'prop-types';
import classNames from 'classnames';

import './PidorDay.css';

import Button from 'components/Button';

const PidorDay = ({ className, user, onClick, ...restProps }) => {
    const name = `${user.first_name} ${user.last_name}`;

    function handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (onClick) {
            onClick();
        }
    }

    return (
        <a
            className={classNames(className, 'PidorDay')}
            href={`https://vk.com/id${user.vk_user_id}`}
            target="_blank"
            rel="noopener noreferrer"
            {...restProps}>
            <div className="PidorDay__avatar">
                <img src={user.avatar_200} alt={name} />
            </div>
            <h2 className="PidorDay__name" children={name} />
            <p className="PidorDay__status" children="Пидор дня" />

            <Button
                size="medium"
                full
                children="Стать пидором дня"
                onClick={handleButtonClick} />
        </a>
    );
};

PidorDay.propTypes = {
    className: string,
    user: shape({
        vk_user_id: number,
        avatar_200: string,
    }),
    onClick: func
};

export default PidorDay;