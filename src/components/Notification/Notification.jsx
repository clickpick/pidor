import React, { useState, useEffect } from 'react';
import { string } from 'prop-types';

import './Notification.css';

import { Transition } from 'react-transition-group';
import persik from 'images/persik.png';

const duration = 300;

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
};

const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
};

const Notification = ({ title, subtitle, ...restProps }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    return (
        <Transition in={show} timeout={duration}>
            {(state) =>
                <div className="Notification" {...restProps} style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}>
                    <div className="Notification__before">
                        <img className="Notification__persik" src={persik} alt="persik" />
                    </div>
                    <div className="Notification__main">
                        <h2 className="Notification__title" children={title} />
                        <p className="Notification__subtitle" children={subtitle} />
                    </div>
                </div>
            }
        </Transition>
    );
};

Notification.propTypes = {
    title: string.isRequired,
    subtitle: string.isRequired
};

export default Notification;