declare let DEV : boolean;

declare namespace Jason {

    const enum DownloadStatus {
        NotStarted,
        InProgress,
        Complete,
        Failed
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
                validate: Validate
                }
            }
        }
    }

    interface DocumentState {
        downloadStatus?: DownloadStatus;
        data?: any;

    }

    interface State {
        document: DocumentState,
    }
}



declare namespace Jason.Actions {
    const enum Types {
        RENDER = 'RENDER',
        UPDATE_RENDER = 'UPDATE_RENDER',
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

    interface UpdateRenderPayload {
        downloadStatus: Jason.DownloadStatus
        data?: any
    }

    interface UpdateRender extends ActionCreator<UpdateRenderPayload> {}

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
    export function controlStyle(field: any): string;
    export function formatString(...args: (string | number)[]): string;
    export function setDefaults(schema: Jason.Schema, context: any, values: any): any;
    export function getValidate(schema: Jason.Schema) : (values: any) => any
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

