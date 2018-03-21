import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form'


const document = (state: Jason.DocumentState = {}, action: any) => {
    switch(action.type){
        case Jason.Actions.Types.UPDATE_RENDER:
            return {...state, ...action.payload}
    }
    return state;
}

const dialogs = (state: Jason.DialogState = {}, action: any) => {
    switch(action.type){
        case Jason.Actions.Types.SHOW_CONFIRMATION:
            return {...state, showing: 'confirmation', confirmation: action.payload}
        case Jason.Actions.Types.HIDE_CONFIRMATION:
            return {...state, showing: null, confirmation: null}
        case Jason.Actions.Types.SHOW_SAVE:
            return {...state, showing: 'save'}
        case Jason.Actions.Types.HIDE_SAVE:
            return {...state, showing: null}
        case Jason.Actions.Types.SHOW_LOAD:
            return {...state, showing: 'load'}
        case Jason.Actions.Types.HIDE_LOAD:
            return {...state, showing: null}
        case Jason.Actions.Types.SHOW_RESTORE:
            return {...state, showing: 'restore'}
        case Jason.Actions.Types.HIDE_RESTORE:
            return {...state, showing: null}
        case Jason.Actions.Types.SHOW_PREVIEW:
            return {...state, showing: 'preview'}
        case Jason.Actions.Types.HIDE_PREVIEW:
            return {...state, showing: null}
        case Jason.Actions.Types.SHOW_COMPLETE:
            return {...state, showing: 'complete'}
        case Jason.Actions.Types.HIDE_COMPLETE:
            return {...state, showing: null}

    }
    return state;
}

const saved = (state: Jason.Saved = {list: [] as [Jason.SavedItemSummary]}, action: any) => {
    switch(action.type){
        case Jason.Actions.Types.UPDATE_SAVED_LIST:
            return {...action.payload}
    }
    return state;
}

const wizard = (state: Jason.Wizard = {}, action: any) => {
    switch(action.type){
        case Jason.Actions.Types.SET_WIZARD_PAGE:
            return {...state, [action.payload.name]: {page: action.payload.page}}
    }
    return state;
}


const appReducer: Reducer<any> = combineReducers<any>({
    routing,
    form,
    dialogs,
    saved,
    document,
    wizard
});



export default appReducer;
