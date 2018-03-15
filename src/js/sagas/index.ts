import { select, takeEvery, put, take, call, all } from 'redux-saga/effects';
import { SagaMiddleware, delay, eventChannel, END } from 'redux-saga';
import * as Axios from 'axios';
import axios from 'axios';
import { updateRender } from '../actions';

export default function *rootSaga(): any {
    yield all([
        renderSaga()
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