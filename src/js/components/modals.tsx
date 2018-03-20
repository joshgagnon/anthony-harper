import * as React from "react";
import { FormGroup, ControlLabel, FormControl, Form, Col, Grid, Tabs, Tab, Button, Glyphicon, ProgressBar, Modal, ButtonGroup, ListGroup, ListGroupItem, ToggleButton  } from 'react-bootstrap';
import { render, hideConfirmation, showConfirmation, requestSavedList, saveState, loadState, deleteState, showSave, showLoad, hideSave, hideLoad, hideRestore, hidePreview, hideComplete, download } from'../actions';
import Loading, { LoadingOverlay } from './loading';
import { reduxForm, InjectedFormProps, Field, WrappedFieldProps, formValues, FormSection, FieldArray, formValueSelector, getFormValues, WrappedFieldArrayProps, submit,  initialize} from 'redux-form';
import { connect } from 'react-redux';
import { TextFieldRow, ToggleButtonFieldRow, required } from './formLoader';
import { Preview, buildRenderObject } from './preview';
import templateSchemas from '../schemas';


export class SaveModal extends React.PureComponent<{
    saveMode: boolean,
    handleClose: () => void,
    loading: boolean,
    entries: [Jason.SavedItemSummary],
    courtCostsValues: any,
    request: () => void,
    save: (args: Jason.Actions.SaveStatePayload) => void,
    overwrite: (args: Jason.Actions.SaveStatePayload) => void,
    deleteEntry: (args: Jason.Actions.DeleteStatePayload) => void,
    load: (args: Jason.Actions.LoadStatePayload) => void,

    } & InjectedFormProps> {

    componentWillMount() {
        this.props.request();
    }

    save(values: any) {
        //localStorage.setItem(values.name, JSON.stringify(this.props.courtCostsValues));
        // if name collides, add id
        const match = this.props.entries.find((item: Jason.SavedItemSummary) => {
            return item.name === values.name;
        })
        this.props.handleClose();;
        if(match){
            this.props.overwrite({name: values.name, data: this.props.courtCostsValues, saved_id: match.saved_id});
        }
        else{
            this.props.save({name: values.name, data: this.props.courtCostsValues});
        }
    }

    deleteItem(e: React.MouseEvent<Button>, saved_id: number) {
        e.stopPropagation();
        this.props.deleteEntry({saved_id});
    }

    handleClick(item: Jason.SavedItemSummary) {
        if(this.props.saveMode){
             this.props.change('name', item.name)
        }
        else{
            this.props.load({saved_id: item.saved_id});
        }
    }


    render(){
        const { handleSubmit } = this.props;
        return <Modal show={true} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{ this.props.saveMode ? 'Save' : 'Load' }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form horizontal >
                 { this.props.loading && <Loading />}
                    <ListGroup style={{ maxHeight: 200, overflowY: 'scroll' }}>
                    { this.props.entries.map((item: Jason.SavedItemSummary) =>
                            <a className="btn btn-default list-group-item text-left" key={item.saved_id} onClick={() => this.handleClick(item)}>
                         { item.name }
                         <Button bsSize="xs" className="pull-right" onClick={(e) => this.deleteItem(e, item.saved_id) }><Glyphicon glyph="remove"/></Button>
                         </a>) }
                  </ListGroup>
                 { this.props.saveMode && <Field name="name" title="Name" component={TextFieldRow} validate={required}/> }
                </Form>
               </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.handleClose}>Close</Button>
                    { this.props.saveMode && <Button bsStyle="primary" onClick={handleSubmit((values) => this.save(values))}>Save</Button> }
                </Modal.Footer>
               </Modal>
    }
}


const ConnectedSaveModal = connect<{entries: [Jason.SavedItemSummary], courtCostsValues: any, saveMode: boolean}, {}, {}>((state: Jason.State) => {
    return {
        entries: state.saved.list || ([] as [Jason.SavedItemSummary]),
        loading: state.saved.status !== Jason.DownloadStatus.Complete,
        courtCostsValues: getFormValues('cc')(state),
        saveMode: true,
    };
}, {
    request: () => requestSavedList({}),
    save: (args: Jason.Actions.SaveStatePayload) => saveState(args),
    overwrite: (args: Jason.Actions.SaveStatePayload) => showConfirmation({title: 'Overwrite',
                                  message: 'Are you sure you wish to save over this entry?',
                                  rejectLabel: 'Cancel', acceptLabel: 'Overwrite',
                                  acceptActions: [saveState(args)],
                                  rejectActions: [showSave()]
                              }),
    deleteEntry: (args: Jason.Actions.DeleteStatePayload) => showConfirmation({title: 'Deleted Saved Entry',
                                  message: 'Are you sure you wish to delete this entry?',
                                  rejectLabel: 'Cancel', acceptLabel: 'Delete',
                                  acceptActions: [deleteState(args), showSave()],
                                  rejectActions: [showSave()]
                              }),
    handleClose: () => hideSave()
})(reduxForm<{}>({form: 'save'})(SaveModal as any) as any);

const ConnectedLoadModal = connect<{entries: [Jason.SavedItemSummary], courtCostsValues: any, saveMode: boolean}, {}, {}>((state: Jason.State) => {
    return {
        entries: state.saved.list || ([] as [Jason.SavedItemSummary]),
        loading: state.saved.status !== Jason.DownloadStatus.Complete,
        courtCostsValues: getFormValues('cc')(state),
        saveMode: false,
    };
}, {
    request: () => requestSavedList({}),
    deleteEntry: (args: Jason.Actions.DeleteStatePayload) => showConfirmation({title: 'Deleted Saved Entry',
                                  message: 'Are you sure you wish to delete this entry?',
                                  rejectLabel: 'Cancel', acceptLabel: 'Delete',
                                  acceptActions: [deleteState(args), showLoad()],
                                  rejectActions: [showLoad()]
                              }),
    load: (args: Jason.Actions.LoadStatePayload) => showConfirmation({title: 'Load Saved Entry',
                                  message: 'Are you sure load this entry? All unsaved changes will be lost.',
                                  rejectLabel: 'Cancel', acceptLabel: 'Load',
                                  acceptActions: [loadState(args)],
                                  rejectActions: [showLoad()]
                              }),
    handleClose: () => hideLoad()
})(reduxForm<{}>({form: 'save'})(SaveModal as any) as any);

interface ConfirmationProps extends Jason.Confirmation{
    hide: () => void,
    accept: () => void,
    reject: () => void
}

export class ConfirmationDialog extends React.PureComponent<ConfirmationProps> {
    render() {
        return <Modal show={true} onHide={this.props.reject}>
                <Modal.Header closeButton>
                    <Modal.Title>{ this.props.title }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <p>{ this.props.message }</p>
               </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.reject}>{ this.props.rejectLabel }</Button>
                    <Button bsStyle="primary" onClick={this.props.accept}>{ this.props.acceptLabel }</Button>
                </Modal.Footer>
               </Modal>
    }
}

const ConnectedConfirmationDialog = connect((state: Jason.State) => ({
    ...state.dialogs.confirmation
}), (dispatch) => ({ dispatch }), (ownProps: Jason.Confirmation, dispatchProps: {dispatch: (args: any) => void}) => {
    return {
    ...ownProps,
    hide: () => dispatchProps.dispatch(hideConfirmation({})),
    reject: () => {
        dispatchProps.dispatch(hideConfirmation({}));
        (ownProps.rejectActions || []).map((action: any) => {
            return dispatchProps.dispatch(action)
        });
    },
    accept: () => {
        dispatchProps.dispatch(hideConfirmation({}));
        (ownProps.acceptActions || []).map((action: any) => {
            return dispatchProps.dispatch(action)
        });
    }
}})(ConfirmationDialog as any)

interface RestoreProps {
    handleClose: () => void;
    setForm: (name: string, args: any) => void;
}

export class Restore extends React.PureComponent<RestoreProps> {
    constructor(props: RestoreProps) {
        super(props);
        this.handleNo = this.handleNo.bind(this);
        this.handleRestore = this.handleRestore.bind(this);
    }

    handleNo() {
        localStorage.removeItem('saved');
        this.props.handleClose();
    }

    handleRestore() {
        try{
            const { name, values } = JSON.parse(localStorage.getItem('saved'));
            this.props.setForm(name, values);
        }catch(e){};
        localStorage.removeItem('saved');
        this.props.handleClose();
    }

    render() {
        return <Modal show={true} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Restore Previous Session</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <p>
                    Would you like to restore your previous session?
                </p>
               </Modal.Body>
                <Modal.Footer>
                <Button onClick={this.handleNo}>No</Button>
                <Button onClick={this.handleRestore} bsStyle="primary">Restore</Button>
                </Modal.Footer>
               </Modal>
    }

}

const ConnectedRestore = connect(undefined, {
    handleClose: hideRestore,
    setForm: (name: string, args: any) => initialize(name, args)
})(Restore as any)


export class PreviewModal extends React.PureComponent<{  handleClose: () => void }> {

    render() {
        return <Modal show={true} onHide={this.props.handleClose} bsSize="large">
                <Modal.Header closeButton>
                    <Modal.Title>Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Preview />
               </Modal.Body>
               </Modal>
    }

}

const ConnectedPreviewModal = connect(undefined, {
    handleClose: hidePreview,
})(PreviewModal as any)


export class FileFormat extends React.PureComponent<{}> {
    render() {
        return <Form  horizontal>
         <Field title={'File Name'} name={'filename'} component={TextFieldRow}/>
           <Field title={'File Type'} name={'fileType'} component={ToggleButtonFieldRow}  columnWidth={9}>
            <ToggleButton value="docx"><i className="fa fa-file-word-o"/> Word (.docx)</ToggleButton>
            <ToggleButton value="pdf"><i className="fa fa-file-pdf-o"/> PDF (.pdf)</ToggleButton>
            <ToggleButton value="odt"><i className="fa fa-file-text-o"/>  OpenDocument (.odt)</ToggleButton>
         </Field>

        </Form>
    }
}

const FileFormatForm = reduxForm<{}>({
    form: 'fileFormat'
})(FileFormat as any);

export class Complete extends React.PureComponent<{handleClose: () => void, schemaName: string, category: string, getValues : () => any,  getFileValues : () => any, download : (data: any) => void}> {

    constructor(props: any){
        super(props);
        this.download = this.download.bind(this);
    }

    download() {
        const type = templateSchemas[this.props.category].schemas[this.props.schemaName];
        const fileValues = this.props.getFileValues();
        this.props.download({...buildRenderObject(fileValues.filename, this.props.category, this.props.schemaName, this.props.getValues(), {}), ...fileValues});
    }

    render() {
        const filename = this.props.schemaName;
        return (
            <Modal show={true} onHide={this.props.handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Complete Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   <FileFormatForm ref="form" initialValues={{fileType: 'docx', filename}} />
                    <div className="icon-action-page">
                    <div className="actionable select-button" onClick={this.download}>
                        <Glyphicon glyph='download'/>
                        <span className="transaction-button-text">Download Document</span>
                    </div>
                    <div className="disabled select-button">
                        <Glyphicon glyph='envelope'/>
                        <span className="transaction-button-text">Email Document</span>
                    </div>
                    <div className="disabled select-button">
                        <Glyphicon glyph='floppy-save'/>
                        <span className="transaction-button-text">Save to File Cabinet</span>
                    </div>
                    <div className="disabled select-button">
                        <Glyphicon glyph='pencil'/>
                        <span className="transaction-button-text">Add Signatures with CataLex Sign</span>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        );
    }

}

const ConnectedComplete = connect((state: Jason.State) => {
    const formLoader = getFormValues('formLoader')(state) as any;

    return {
        schemaName: formLoader.schema,
        category: formLoader.category,
        getValues: () => getFormValues(`${formLoader.category}.${formLoader.schema}`)(state),
        getFileValues: () => getFormValues('fileFormat')(state)
    }
}, {
    handleClose: hideComplete,
    download: download
})(Complete as any)


export class Modals extends React.PureComponent<{downloading: boolean, showing: string}> {
    render() {
        if(this.props.showing === 'preview'){
            return <ConnectedPreviewModal />
        }
        if(this.props.downloading){
            return <LoadingOverlay />
        }
        if(this.props.showing === 'confirmation'){
            return <ConnectedConfirmationDialog />
        }
        if(this.props.showing === 'save'){
            return <ConnectedSaveModal  />
        }
        if(this.props.showing === 'load'){
            return <ConnectedLoadModal/>
        }
        if(this.props.showing === 'restore'){
            return <ConnectedRestore />
        }
        if(this.props.showing === 'complete'){
            return <ConnectedComplete />
        }
        return false;
    }
}


const ConnectedModals = connect((state: Jason.State) => ({
    downloading: state.document.downloadStatus === Jason.DownloadStatus.InProgress,
    showing: state.dialogs.showing
}))(Modals as any)

export default ConnectedModals;

