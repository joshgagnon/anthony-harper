import { select, takeEvery, put, take, call, all } from 'redux-saga/effects';
import { SagaMiddleware, delay, eventChannel, END } from 'redux-saga';
import * as Axios from 'axios';
import { initialize } from 'redux-form';
import axios from 'axios';
import { updateRender, updateSavedList, requestSavedList, hideComplete } from '../actions';
import Filesaver from 'file-saver';


export default function *rootSaga(): any {
    yield all([
        renderSaga(),
        downloadSaga(),
    ]);
}



function *renderSaga() {
    yield takeEvery(Jason.Actions.Types.RENDER, render);
    function *render(action: Jason.Actions.Render) {
        yield put(updateRender({
            downloadStatus: Jason.DownloadStatus.InProgress
        }));
        let data;
        try {
            const response = yield call(axios.post, `/api/render`, action.payload.data, {responseType: 'arraybuffer' });
            data = response.data;
            yield put(updateRender({
                downloadStatus: Jason.DownloadStatus.Complete,
                data
            }));

        } catch(e) {
            yield put(updateRender({
                downloadStatus: Jason.DownloadStatus.Failed,
            }));
        }
    }
}


function *downloadSaga() {
    yield takeEvery(Jason.Actions.Types.DOWNLOAD, render);
    function *render(action: Jason.Actions.Render) {
        yield put(updateRender({
            downloadStatus: Jason.DownloadStatus.InProgress
        }));
        let data;
        try {
            const response = yield call(axios.post, `/api/render`, action.payload, {responseType: 'arraybuffer' });
            data = response.data;
            yield put(updateRender({
                downloadStatus: Jason.DownloadStatus.Complete,
                data
            }));

            var blob = new Blob([data], {type: response.headers['content-type']});
            const disposition = response.headers['content-disposition'];
            const filename = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)[1].replace(/"/g, '');
            (Filesaver as any)(blob, filename);
            yield put(hideComplete({}));
        } catch(e) {
            debugger
            yield put(updateRender({
                downloadStatus: Jason.DownloadStatus.Failed,
            }));
        }
    }

}


function *saveSaga() {
    yield takeEvery(Jason.Actions.Types.SAVE_STATE, save);
    function *save(action: Jason.Actions.SaveState) {
        yield put(updateSavedList({
            status: Jason.DownloadStatus.InProgress
        }));
        let data;
        try {
            let response;
            if(action.payload.saved_id){
                response = yield call(axios.put, `/api/saved/${action.payload.saved_id}`, action.payload);
            }
            else{
                response = yield call(axios.post, `/api/saved`, action.payload);

            }
            data = response.data;
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Complete
            }));

        } catch(e) {
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Failed,
            }));
        }
    }

}

function *deleteSaga() {
    yield takeEvery(Jason.Actions.Types.DELETE_STATE, del);
    function *del(action: Jason.Actions.SaveState) {
        yield put(updateSavedList({
            status: Jason.DownloadStatus.InProgress
        }));
        let data;
        try {
            let response = yield call(axios.delete, `/api/saved/${action.payload.saved_id}`, action.payload);
            data = response.data;
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Complete
            }));

        } catch(e) {
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Failed,
            }));
        }
            yield put(requestSavedList({
            }));
    }

}

function *loadSaga() {
    yield takeEvery(Jason.Actions.Types.LOAD_STATE, load);
    function *load(action: Jason.Actions.LoadState) {
        yield put(updateSavedList({
            status: Jason.DownloadStatus.InProgress
        }));
        let data;
        try {
            let response = yield call(axios.get, `/api/saved/${action.payload.saved_id}`);
            data = response.data;

            yield put(updateSavedList({
                status: Jason.DownloadStatus.Complete
            }));
            if(data && data.data){
                yield put(initialize('formLoader', data.data));
            }

        } catch(e) {
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Failed,
            }));
        }
    }
}

function *savedListSaga() {
    yield takeEvery(Jason.Actions.Types.REQUEST_SAVED_LIST, handle);
    function *handle(action: Jason.Actions.RequestSavedList) {
        yield put(updateSavedList({
            status: Jason.DownloadStatus.InProgress
        }));
        let data;
        try {
            const response = yield call(axios.get, `/api/saved`);
            data = response.data;
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Complete,
                list: data
            }));

        } catch(e) {
            yield put(updateSavedList({
                status: Jason.DownloadStatus.Failed,
            }));
        }
    }
}