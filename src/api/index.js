const requestPost = (urn, data) =>
    window.axios.post(urn, data)
        .then(({ data: { data }, status }) => ({ data, status }));

const requestGet = (urn) =>
    window.axios.get(urn)
        .then(({ data: { data }, status }) => ({ data, status }));

export const auth = (data) => requestPost('/auth', data);

export const friends = () => requestGet('/friends');

export const pidorOfTheDay = () => requestGet('/pidor-of-the-day');

export const postStory = (upload_url) => requestPost('/post-story', { upload_url });