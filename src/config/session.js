export const getSession = (key = '') => {
    if (key !== '') {
        let value = window.sessionStorage.getItem(key);
        return value ?? '';
    } else {
        return '';
    }
};

export const setSession = (key = '', value = '') => {
    if (key !== '' && value !== '') {
        window.sessionStorage.setItem(key, value);
        return true;
    } else {
        return false;
    }
};

export const removeSession = (key = '') => {
    if (key !== '') {
        window.sessionStorage.removeItem(key);
        return true;
    } else {
        return false;
    }
};

export const cleanSession = () => {
    window.sessionStorage.clear();
};
