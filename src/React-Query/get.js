import { useMutation, useQuery } from 'react-query';
import { axios } from '../config/axios';


export const userLoginData = (data) => {
    return axios.get('admin/basic/getAllUserDetails', { ...data });
}

export const useFetchUserLogin = () => {
    return useQuery({
        queryKey: ["user-table"],
        queryFn: () => userLoginData(),
        select: (res) => res.data,
    });
};

export const userKycData = (data) => {
    return axios.get('admin/basic/getAllKycDetails', { ...data });
}

export const useFetchUserKyc = () => {
    return useQuery({
        queryKey: ["kyc-table"],
        queryFn: () => userKycData(),
        select: (res) => res.data,
    });
}