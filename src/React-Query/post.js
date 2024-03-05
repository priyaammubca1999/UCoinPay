import { useMutation } from 'react-query';
import { axios } from '../config/axios';

export const adminLogin = (data) => {
    return axios.post('admin/basic/login', { ...data });
};

export const useAdminLogin = () => {
    return useMutation(adminLogin, {
        onSuccess: (loginSuccessData) => { }
    });
};

export const kycAction = (data) => {
    return axios.post('admin/basic/kycChangeStatus', { ...data });
}

export const useKycAction = () => {
    return useMutation(kycAction, {
        onSuccess: (kycActionData) => { }
    });
}