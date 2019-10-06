import React from 'react';
import { string, number, shape, object } from 'prop-types';
import classNames from 'classnames';

import './PidorDay.css';

import wreath from 'svg/wreath.svg';
import wreathBg from 'svg/wreath-bg.svg';

const PidorDay = ({ className, user, style, ...restProps }) => {
    const name = `${user.first_name} ${user.last_name}`;
    style = {
        ...style,
        '--top-werath': `url('${wreath}')`,
        '--top-werath-bg': `url('${wreathBg}')`,
    };

    return (
        <a
            className={classNames(className, 'PidorDay')}
            href={`https://vk.com/id${user.vk_user_id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={style}
            {...restProps}>
            <div className="PidorDay__avatar">
                <img src={user.avatar_200} alt={name} />
            </div>
            <h2 className="PidorDay__name" children={name} />
            <p className="PidorDay__status" children="Пидор дня" />
        </a>
    );
};

PidorDay.propTypes = {
    className: string,
    user: shape({
        vk_user_id: number,
        avatar_200: string,
    }),
    style: object
};

export default PidorDay;