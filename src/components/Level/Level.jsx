import React, { useState, useEffect } from 'react';
import { string, number } from 'prop-types';
import classNames from 'classnames';

import './Level.css';

const Level = ({ className, radius, stroke, progress, avatar, gif, title, subtitle }) => {
    const [currentProgress, setCurrentProgress] = useState(0);

    /**
     * Анимация прогресса
     */
    useEffect(() => {
        if (currentProgress < progress) {
            let nextProgress = currentProgress + 6;
            let duration = 35;

            if (currentProgress / progress >= 0.45) {
                duration = 45;
                nextProgress = currentProgress + 3;
            }

            if (currentProgress / progress >= 0.85) {
                duration = 85;
                nextProgress = currentProgress + 1;
            }

            if (nextProgress <= progress && currentProgress !== progress) {
                setTimeout(() => setCurrentProgress(nextProgress), duration);
            }
        }

        if (currentProgress > progress) {
            let nextProgress = currentProgress - 1;

            if (nextProgress >= progress && currentProgress !== progress) {
                setTimeout(() => setCurrentProgress(nextProgress), 35);
            }
        }
    }, [currentProgress, progress]);

    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const size = radius * 2;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - currentProgress / 100 * circumference * 0.89;

    return (
        <div className={classNames(className, 'Level')}>
            <div className="Level__progress-wrapper">
                <svg
                    className="Level__progress"
                    width={size}
                    height={size}>
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#5FCBFF" />
                            <stop offset="100%" stopColor="#355FF6" />
                        </linearGradient>
                    </defs>
                    <circle
                        stroke="url(#gradient)"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={strokeDasharray}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius} />
                </svg>

                <div className="Level__avatar" style={{ '--level-progress': progress / 100 }}>
                    <video
                        src={gif}
                        poster={avatar}
                        playsInline
                        loop
                        muted
                        autoPlay />
                </div>

                <div className="Level__percent" children={`${currentProgress}%`} />
            </div>

            <div className={classNames('Level__text', { 'Level__text--hide': currentProgress !== progress })}>
                <h2 className="Level__title" children={title} />
                <p className="Level__subtitle" children={subtitle} />
            </div>
        </div>
    );
};

Level.propTypes = {
    className: string,
    radius: number,
    stroke: number,
    progress: number.isRequired,
    gif: string.isRequired,
    avatar: string,
    title: string.isRequired,
    subtitle: string.isRequired
};

Level.defaultProps = {
    radius: 150,
    stroke: 5
};

export default Level;
