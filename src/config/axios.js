import Axios from 'axios';

import { BACKEND_URL } from './index';

export const axios = Axios.create({
    baseURL: BACKEND_URL
});

export const Request = ({ ...options }) => {
    const onSuccess = (response) => response;

    const onError = (error) => {
        return error;
    };

    return axios(options).then(onSuccess).catch(onError);
};
