declare let DEV : boolean;

declare namespace Jason {

    type SelectorType = (state: any, ...field: string[]) => any;

    const enum DownloadStatus {
        NotStarted,
        InProgress,
        Complete,
        Failed
    }

    interface Confirmation {
        title: string,
        message: string,
        acceptLabel: string,
        rejectLabel: string,
        acceptActions?: any[],
        rejectActions?: any[]
    }

    interface DialogState {
        showing?: string,
        confirmation?: Confirmation
    }

    interface SavedItemSummary {
        saved_id: any,
        name: string,
    }

    interface Saved {
        status?: DownloadStatus,
        list: [SavedItemSummary]
    }

    interface SchemaProperties {
        title?: string,
    }

    interface Schema {
        title?: string;
        formName?: string;
        description?: string;
        definitions: any,
        properties: SchemaProperties & any,
        oneOf?: any[];
        wizard?: any;
    }

    type Validate = (values: any) => any;

    interface TemplateSchemas {
        [category: string] : {
            name : string,
            schemas: {[schema: string] : {
                schema: Schema,
                validate: Validate,
                validatePages: Validate[]
                }
            }
        }
    }
    interface DialogState {
        showing?: string,
        confirmation?: Confirmation
    }
    interface Saved {
        status?: DownloadStatus,
        list: [SavedItemSummary]
    }
    interface DocumentState {
        downloadStatus?: DownloadStatus;
        data?: any;

    }

    interface Wizard {
        [name: string]: {
            page: number
        }
    }

    interface State {
        document: DocumentState,
        dialogs: DialogState,
        saved: Saved,
        wizard: Wizard
    }
}



declare namespace Jason.Actions {
    const enum Types {
        RENDER = 'RENDER',
        UPDATE_RENDER = 'UPDATE_RENDER',
        REQUEST_SAVED_LIST = 'REQUEST_SAVED_LIST',
        UPDATE_SAVED_LIST = 'UPDATE_SAVED_LIST',
        SHOW_CONFIRMATION = 'SHOW_CONFIRMATION',
        HIDE_CONFIRMATION = 'HIDE_CONFIRMATION',
        SAVE_STATE = 'SAVE_STATE',
        LOAD_STATE = 'LOAD_STATE',
        DELETE_STATE = 'DELETE_STATE',
        SHOW_SAVE = 'SHOW_SAVE',
        HIDE_SAVE = 'HIDE_SAVE',
        SHOW_LOAD = 'SHOW_LOAD',
        HIDE_LOAD = 'HIDE_LOAD',
        SHOW_RESTORE = 'SHOW_RESTORE',
        HIDE_RESTORE = 'HIDE_RESTORE',
        SHOW_COMPLETE = 'SHOW_COMPLETE',
        HIDE_COMPLETE = 'HIDE_COMPLETE',
        SHOW_PREVIEW = 'SHOW_PREVIEW',
        HIDE_PREVIEW = 'HIDE_PREVIEW',
        DOWNLOAD = 'DOWNLOAD',
        SET_WIZARD_PAGE = 'SET_WIZARD_PAGE'

    }

    interface ActionCreator<T> {
        type: Jason.Actions.Types;
        payload: T;
    }

    interface Action {
        type: Jason.Actions.Types;
    }

    interface RenderPayload {
        data: any
    }

    interface Render extends ActionCreator<RenderPayload> {}
    interface Download extends ActionCreator<RenderPayload> {}

    interface UpdateRenderPayload {
        downloadStatus: Jason.DownloadStatus
        data?: any
    }

    interface ShowConfirmationPayload extends Jason.Confirmation {

    }

    interface HideConfirmationPayload {}

    interface ShowConfirmation extends ActionCreator<ShowConfirmationPayload> {}
    interface HideConfirmation extends ActionCreator<HideConfirmationPayload> {}

    interface RequestSavedListPayload {

    }

    interface UpdateSavedListPayload {
        status: Jason.DownloadStatus,
        list?: [Jason.SavedItemSummary]
    }

    interface SaveStatePayload {
        saved_id?: any,
        name: string,
        data: any
    }

    interface LoadStatePayload {
        saved_id: any
    }

    interface DeleteStatePayload {
        saved_id: any;
    }

    interface ShowPreviewPayload {

    }

    interface HidePreviewPayload {

    }
    interface ShowCompletePayload {

    }

    interface HideCompletePayload {

    }

    interface SetWizardPagePayload {
        name: string;
        page: number;
    }
    interface UpdateRender extends ActionCreator<UpdateRenderPayload> {}

    interface RequestSavedList extends ActionCreator<RequestSavedListPayload> {}
    interface UpdateSavedList extends ActionCreator<UpdateSavedListPayload> {}
    interface SaveState extends ActionCreator<SaveStatePayload> {}
    interface LoadState extends ActionCreator<LoadStatePayload> {}
    interface DeleteState extends ActionCreator<DeleteStatePayload> {}

    interface ShowSave extends ActionCreator<void> {}
    interface HideSave extends ActionCreator<void> {}
    interface ShowLoad extends ActionCreator<void> {}
    interface HideLoad extends ActionCreator<void> {}
    interface ShowRestore extends ActionCreator<void> {}
    interface HideRestore extends ActionCreator<void> {}
    interface ShowPreview extends ActionCreator<ShowPreviewPayload> {}
    interface HidePreview extends ActionCreator<HidePreviewPayload> {}


    interface ShowComplete extends ActionCreator<ShowCompletePayload> {}
    interface HideComplete extends ActionCreator<HideCompletePayload> {}
    interface SetWizardPage extends ActionCreator<SetWizardPagePayload> {}
}


declare module "*.json" {
    const value: any;
    export default value;
}

declare module 'json-schemer' {
    export function prepareSchema(definitions: any, schemas: any): any;
    export function componentType(object: any): string;
    export function getKey(): string;
    export function addItem(field: any): string;
    export function suggestions(field: any): any;
    export function controlStyle(field: any): string;
    export function formatString(...args: (string | number)[]): string;
    export function setDefaults(schema: Jason.Schema, context: any, values: any): any;
    export function getValidate(schema: Jason.Schema) : (values: any) => any;
    export function getSubSchema(schema: Jason.Schema, stepIndex: number) : Jason.Schema;
    export function getFieldsFromErrors(errors: any) : string[];
}

declare module 'deepmerge' {
    export default function deepmerge(arg1: any, arg2: any): any;
}


declare namespace ReactPDF {
    interface Props {
      data: any;
      scale: number;
      noPDFMsg?: string;
    }
}

declare module 'react-pdf-component/lib/react-pdf' {
    export default class ReactLazyLoad extends React.PureComponent<ReactPDF.Props> {

    }
}

declare module 'react-widgets-moment' {
    function momentLocalizer(moment : any): void;
    namespace momentLocalizer {}
    export = momentLocalizer;
}

