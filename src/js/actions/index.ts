export function render(payload: Jason.Actions.RenderPayload): Jason.Actions.Render{
    return {
        type: Jason.Actions.Types.RENDER,
        payload
    };
}

export function download(payload: Jason.Actions.RenderPayload): Jason.Actions.Render{
    return {
        type: Jason.Actions.Types.DOWNLOAD,
        payload
    };
}


export function updateRender(payload: Jason.Actions.UpdateRenderPayload): Jason.Actions.UpdateRender{
    return {
        type: Jason.Actions.Types.UPDATE_RENDER,
        payload
    };
}


export function showSave(): Jason.Actions.ShowSave{
    return {
        type: Jason.Actions.Types.SHOW_SAVE,
        payload: null
    };
}

export function hideSave(): Jason.Actions.HideSave{
    return {
        type: Jason.Actions.Types.HIDE_SAVE,
        payload: null
    };
}

export function showLoad(): Jason.Actions.ShowLoad{
    return {
        type: Jason.Actions.Types.SHOW_LOAD,
        payload: null
    };
}

export function hideLoad(): Jason.Actions.HideLoad{
    return {
        type: Jason.Actions.Types.HIDE_LOAD,
        payload: null
    };
}

export function showRestore(): Jason.Actions.ShowRestore{
    return {
        type: Jason.Actions.Types.SHOW_RESTORE,
        payload: null
    };
}


export function hideRestore(): Jason.Actions.HideRestore{
    return {
        type: Jason.Actions.Types.HIDE_RESTORE,
        payload: null
    };
}

export function showConfirmation(payload: Jason.Actions.ShowConfirmationPayload): Jason.Actions.ShowConfirmation{
    return {
        type: Jason.Actions.Types.SHOW_CONFIRMATION,
        payload
    };
}


export function hideConfirmation(payload: Jason.Actions.HideConfirmationPayload): Jason.Actions.HideConfirmation{
    return {
        type: Jason.Actions.Types.HIDE_CONFIRMATION,
        payload
    };
}


export function showPreview(payload: Jason.Actions.ShowPreviewPayload): Jason.Actions.ShowPreview{
    return {
        type: Jason.Actions.Types.SHOW_PREVIEW,
        payload
    };
}

export function hidePreview(payload: Jason.Actions.HidePreviewPayload): Jason.Actions.HidePreview{
    return {
        type: Jason.Actions.Types.HIDE_PREVIEW,
        payload
    };
}

export function showComplete(payload: Jason.Actions.ShowCompletePayload): Jason.Actions.ShowComplete{
    return {
        type: Jason.Actions.Types.SHOW_COMPLETE,
        payload
    };
}

export function hideComplete(payload: Jason.Actions.HideCompletePayload): Jason.Actions.HideComplete{
    return {
        type: Jason.Actions.Types.HIDE_COMPLETE,
        payload
    };
}

export function requestSavedList(payload: Jason.Actions.RequestSavedListPayload): Jason.Actions.RequestSavedList{
    return {
        type: Jason.Actions.Types.REQUEST_SAVED_LIST,
        payload
    };
}

export function updateSavedList(payload: Jason.Actions.UpdateSavedListPayload): Jason.Actions.UpdateSavedList{
    return {
        type: Jason.Actions.Types.UPDATE_SAVED_LIST,
        payload
    };
}


export function saveState(payload: Jason.Actions.SaveStatePayload): Jason.Actions.SaveState{
    return {
        type: Jason.Actions.Types.SAVE_STATE,
        payload
    };
}

export function loadState(payload: Jason.Actions.LoadStatePayload): Jason.Actions.LoadState{
    return {
        type: Jason.Actions.Types.LOAD_STATE,
        payload
    };
}

export function deleteState(payload: Jason.Actions.DeleteStatePayload): Jason.Actions.DeleteState{
    return {
        type: Jason.Actions.Types.DELETE_STATE,
        payload
    };
}


export function setWizardPage(payload: Jason.Actions.SetWizardPagePayload) : Jason.Actions.SetWizardPage {
    return {
        type: Jason.Actions.Types.SET_WIZARD_PAGE,
        payload
    }
}