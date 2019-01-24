import {
    SEND_DOCS,
    SUCCESS_DOCS,
    PENDING_DOCS,
    ERROR_DOCS
} from '@/constants/action-types/docs';

export const initialState = {
    pending: false,
    success: false,
    error: false
};

export default (state = initialState, { type, ...action }) => {
    switch (type) {
        case SEND_DOCS:
        case PENDING_DOCS:
            return {
                ...state,
                pending: true,
                success: false
            };
        case SUCCESS_DOCS:
            return {
                ...state,
                pending: false,
                success: true
            };
        case ERROR_DOCS:
            return {
                ...state,
                pending: false,
                success: false,
                error: action.error
            };
        default:
            return state;
    }
};
