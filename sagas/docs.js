import { all, call, put, takeLatest, select } from 'redux-saga/es/effects';
import {
    setErrorDocs,
    successDocs
} from '@/actions/docs';
import { SEND_DOCS } from '@/constants/action-types/docs';

export const sendDocsSaga = function* (api, { payload }) {
    const { events } = yield select(state => state);

    const docs = Array.isArray(payload) ? [...payload] : [payload];

    let requests = [];

    docs.forEach(({ files, doctype, event }) => {
        const req = files.map(function* (file) {
            const data = new FormData();
            data.append('name', file.name);
            data.append('size', file.size);
            data.append('type', file.type);
            data.append('file', file);
            return yield call(api.docs.sendFile, {
                params: {
                    doctype,
                    time: events[event]
                },
                data,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        });
        requests = [...requests, ...req];
    });

    try {
        const responses = yield all(requests);
        
        responses.forEach(({ data: { error } }) => {
            if (error) {
                throw new Error(error);
            }
        });

        const successDocsAction = successDocs();
        yield put(successDocsAction);
        return true;
    } catch (error) {
        const setErrorDocsAction = setErrorDocs(true);
        yield put(setErrorDocsAction);
    }
    return false;
};

export const sendDocsWatch = function* (api) {
    yield takeLatest(SEND_DOCS, sendDocsSaga, api);
};
