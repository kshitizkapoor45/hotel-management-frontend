let getAccessToken: (() => string | null) | null = null;

export const setAccessTokenGetter = (getter: () => string | null) => {
    getAccessToken = getter;
};

export const getAccessTokenValue = () => {
    return getAccessToken ? getAccessToken() : null;
};