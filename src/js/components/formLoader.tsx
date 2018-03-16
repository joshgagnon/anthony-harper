import * as React from "react";
import { reduxForm, InjectedFormProps, Field, WrappedFieldProps, formValues, FormSection, FieldArray, formValueSelector, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import templateSchemas from '../schemas';
import { FormGroup, ControlLabel, FormControl, Form, Col, Grid, Tabs, Tab, Button, Glyphicon, ProgressBar } from 'react-bootstrap';
import { componentType, getKey, addItem, setDefaults, getValidate, controlStyle, formatString } from 'json-schemer';
import FlipMove from 'react-flip-move';
import { render } from '../actions';
import PDF from 'react-pdf-component/lib/react-pdf';
import Loading from './loading';
import * as DateTimePicker from 'react-widgets/lib/DateTimePicker'
import * as moment from 'moment';


function isCheckbox(enums : (string | boolean)[]) {
    return enums.length === 2 && ((enums[0] === false && enums[1] === true) || (enums[1] === false && enums[0] === true));
}

const INITIAL_VALUES = require('anthony-harper-templates/test_data/AEC-250770-98-449-1 LOE 2018 for Catalex/simple.json');

type SelectorType = (state: any, ...field: string[]) => any;

interface FormSetProps {
    schema: Jason.Schema,
    subSchema?: Jason.Schema
    name?: string,
    index?: number,
    selector: SelectorType
}


class UnconnectedFormSet extends React.PureComponent<FormSetProps> {
    render() {
        const { schema, subSchema, selector, index, name } = this.props;
        const { properties, title } = schema;
        const schemaProps = properties;

        return (
            <fieldset>
             { title && <legend>{title}</legend>}
                { Object.keys(schemaProps).map((key, i) => {
                    return <RenderField key={i} field={schemaProps[key]} name={key} selector={selector} index={index} parentName={name}/>
                }) }
                { subSchema && <FormSet schema={subSchema} name={this.props.name} selector={selector} /> }
            </fieldset>
        );

    }
}

const FormSet = connect<{}, {}, FormSetProps>((state: Jason.State, ownProps: FormSetProps) => {
    if(ownProps.schema.oneOf) {
        const getMatchingOneOf = (oneOfs: any, value: any, key: string) => {
            return oneOfs.filter((x : Jason.Schema) => x.properties[key].enum[0] === value)[0] || {};
        };
        let selectKey;
        const { properties } = ownProps.schema;
        Object.keys(properties).map((key, i) => {
            if(properties[key].enum){
                selectKey = key;
            }
        });
        if(selectKey){
            const value = (ownProps.selector(state, ownProps.name) || {})[selectKey];
            if(value){
                return {
                    subSchema: getMatchingOneOf(ownProps.schema.oneOf, value, selectKey)
                }
            }
        }

    }
    return {

    }
})(UnconnectedFormSet as any);


class RenderField extends React.PureComponent<{field: any, name: string, index?: number, parentName?: string, selector: (name: any) => any}> {
    render() : false | JSX.Element {
        const { name, field, selector, index } = this.props;
        const title = field.enumeratedTitle ? formatString(field.enumeratedTitle, index+1) : field.title;
        switch(field.type){
            case 'object': {
                const deepName = this.props.parentName ? `${this.props.parentName}.${name}` : name;
                return <FormSection name={name}>
                        <FormSet schema={(this.props.field as Jason.Schema)} name={deepName} selector={selector} index={index}/>
                    </FormSection>
            }
            case 'array': {
                return <FieldArray name={name} component={FieldsArray} props={{field: field.items, title: field.title, selector, index}} />
            }
            case 'string': {
                const subType = componentType(field);
                switch(subType){
                    case 'textarea':
                        return <Field title={title} name={name} component={TextAreaFieldRow} />
                    case 'date':
                        return <Field title={title} name={name} component={DateFieldRow} formatDate={field.formatDate}/>
                    default:
                        return <Field title={title} name={name} component={TextFieldRow} />
                }
            }
            case undefined: {
                // the > 1 check is a easy way to not render the oneOf match structures (causes a duplication of the field)

                if(field.enum && field.enum.length > 1){
                    if(isCheckbox(field.enum)){
                        return <Field title={title} name={name} component={CheckboxFieldRow} />
                    }
                    return <Field title={title} name={name} component={SelectFieldRow}>
                         <option value="" disabled>Please Select...</option>
                        { field.enum.map((f: string, i: number) => {
                            return <option key={i} value={f}>{field.enumNames ? field.enumNames[i] : f}</option>
                        })}
                    </Field>
                }
            }
        }

        return false;
    }
}

class MoveUpButton extends React.PureComponent<any> {
    render() {
        const { swapFields, index, numItems, forceDisplay } = this.props;
        const disabled = index === 0;

        if (disabled && !forceDisplay) {
            return false;
        }

        return(
            <button type="button" className="btn btn-default" onClick={() => swapFields(index, index - 1)} disabled={disabled}>
                <Glyphicon glyph="arrow-up"/>
            </button>
        );
    }
}

class MoveDownButton extends React.PureComponent<any>{
    render(){
        const { swapFields, index, numItems, forceDisplay } = this.props;
        const disabled = index + 1 === numItems;

        if (disabled && !forceDisplay) {
            return false;
        }

        return (
            <button type="button" className="btn btn-default" onClick={() => swapFields(index, index + 1)} disabled={disabled}>
                <Glyphicon glyph="arrow-down"/>
            </button>
        );
    }
}
class RemoveButton extends React.PureComponent<any>{
    render(){
        const { index, numItems, minItems, forceDisplay, removeField } = this.props;
        const disabled = minItems >= numItems;

        if (disabled && !forceDisplay) {
            return false;
        }

        return (
            <button type="button" className="btn btn-default" onClick={() => removeField(index)} disabled={disabled}>
                <Glyphicon glyph="remove"/>
            </button>
        );
    }
}



class ListItemControls extends React.PureComponent<any> {
    render() {
        const { index, numItems,inline, fields: { swap, remove }} = this.props;
        return <div className={`${inline ? 'btn-group' : 'btn-group-vertical'} btn-group-xs`} style={{position: 'absolute', right: 0, top: 0}}>
            <MoveUpButton key={0} index={index} swapFields={swap} numItems={numItems} forceDisplay={true} />
            <MoveDownButton key={1} index={index} swapFields={swap} numItems={numItems} forceDisplay={true} />
            <RemoveButton key={2} index={index} removeField={remove} numItems={numItems} forceDisplay={true} />
            </div>

    }
}


class FieldsArray extends React.PureComponent<any> {
    render() {
        const { fields, field, title, selector } = this.props;
        const inline = controlStyle(field) === 'inline';
        return <fieldset className="list">
            { title && <legend>{ title }</legend>}
            <FlipMove duration={250} easing="ease-out">
            { fields.map((name: any, index: number) => {
                return <div key={fields.get(index)._keyIndex}>
                    <div style={{position: 'relative', minHeight: inline ? 0 : 70}}>
                    <RenderField  name={name} field={field} selector={selector} index={index} />
                    <ListItemControls fields={fields} index={index} numItems={fields.length} name={name} inline={inline}/>
                    </div>
                </div>
            }) }
            </FlipMove>
            <div className="text-center">
                <Button onClick={() => fields.push({_keyIndex: getKey()})}>
                    { addItem(field) }
              </Button>
          </div>
            </fieldset>
        }
}




function FieldRow(Component: any) : any {

    return class Wrapped extends React.PureComponent<any> {
        getValidationState() {
            if(this.props.meta.touched){
                return this.props.meta.valid ? 'success' : 'error';
            }
            return null;
        }

        render(){
            const props = this.props;
            return <FormGroup validationState={this.getValidationState()}>
                <Col sm={3} className="text-right">
                    <ControlLabel>{ props.title }</ControlLabel>
                </Col>
                <Col sm={7}>
                     <Component {...props} />
                    <FormControl.Feedback />
                </Col>
            </FormGroup>
        }

    }
}


class RenderForm extends React.PureComponent<InjectedFormProps & {schema: Jason.Schema}> {

    render() {
        const { schema } = this.props;
        return <Form horizontal>
            <p/>
                <FormSet schema={schema} selector={formValueSelector(this.props.form)} />
                { this.props.error && <div className="alert alert-danger">
                { this.props.error }
                </div> }
        </Form>
    }
}

const InjectedRenderForm = reduxForm<any>({})(RenderForm) as any;


class SchemaView extends React.PureComponent<{schema: Jason.Schema}> {
    render() {
        return <pre>
            { JSON.stringify(this.props.schema.properties, null, 4) }
        </pre>
    }
}


class FormView extends React.PureComponent<{schema: Jason.Schema, name: string, validate: Jason.Validate}> {
    render() {
        return <div>
            <InjectedRenderForm
                schema={this.props.schema}
                form={this.props.name}
                key={this.props.name}
                validate={this.props.validate}
                initialValues={setDefaults(this.props.schema, {}, INITIAL_VALUES)}
                />
        </div>
    }
}

function getSubSchema(schema: Jason.Schema, stepIndex: number) : Jason.Schema {
    const fields = schema.wizard.steps[stepIndex].items;
    const properties = Object.keys(schema.properties).reduce((acc: any, key: string) => {

        if(fields.indexOf(key) >= 0){
            acc[key] = schema.properties[key];
        }
        return acc;
    }, {})
    return {...schema, properties}
}


interface WizardViewProps {
    schema: Jason.Schema,
    name: string,
    validate: Jason.Validate
}


class WizardView extends React.PureComponent<WizardViewProps, {step: number}> {

    constructor(props: WizardViewProps) {
        super(props);
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.state = {step: 0}
    }

    lastStep() {
        return this.state.step === this.props.schema.wizard.steps.length - 1;
    }

    firstStep() {
        return this.state.step === 0;
    }

    nextStep() {
        if(!this.lastStep()){
            this.setState({step: this.state.step+1})
        }
    }

    prevStep() {
        if(!this.firstStep()){
            this.setState({step: this.state.step-1})
        }
    }

    render() {
        return <div>
            <br/>
            <ProgressBar striped bsStyle="success"
                now={(this.state.step+1)/(this.props.schema.wizard.steps.length) * 100}
                label={`Step ${this.state.step+1} of ${this.props.schema.wizard.steps.length}`}

                />

            <InjectedRenderForm
                schema={getSubSchema(this.props.schema, this.state.step)}
                form={this.props.name}
                key={this.props.name}
                validate={this.props.validate}
                destroyOnUnmount={false}
                initialValues={setDefaults(this.props.schema, {}, {})}
                />

            <div className="button-row">
                { !this.firstStep() && <Button onClick={this.prevStep}>Back</Button> }
                { !this.lastStep() && <Button onClick={this.nextStep}>Next</Button> }
            </div>
        </div>
    }
}

interface UnconnectedPDFPreviewProps {

}

interface PDFPreviewProps extends UnconnectedPDFPreviewProps {
    data?: any;
    downloadStatus: Jason.DownloadStatus
}

export class UnconnectedPDFPreview extends React.PureComponent<PDFPreviewProps> {
    render() {
        if(this.props.downloadStatus === Jason.DownloadStatus.InProgress)
            return <Loading />
        if(this.props.downloadStatus === Jason.DownloadStatus.Failed)
            return <div className="alert alert-danger">Could not generate document</div>
        if(this.props.downloadStatus === Jason.DownloadStatus.Complete)
            return <PDF data={this.props.data} scale={2.5} noPDFMsg=' '/>
        return false;
    }
}

const PDFPreview = connect((state : Jason.State, ownProps) => ({
    data: state.document.data,
    downloadStatus: state.document.downloadStatus
}))(UnconnectedPDFPreview as any);

interface UnconnectedPreviewProps {
   category: string,
   schemaName: string,
   form: string,
   selector: SelectorType
}

interface PreviewProps extends UnconnectedPreviewProps {
     render: (data: Jason.Actions.RenderPayload) => void,
     getValues: () => any,
}

export class UnconnectedPreview extends React.PureComponent<PreviewProps> {

    constructor(props: PreviewProps) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    buildRenderObject(values : any, metadata = {}) {
        const type = templateSchemas[this.props.category].schemas[this.props.schemaName];
        const schema = type.schema;
        const filename = schema.title;
        return {
            formName: schema.formName,
            templateTitle: schema.title,
            values: {...values, filename},
            metadata,
            env: templateSchemas[this.props.category].name
        };
    }

    submit() {
        this.props.render({data: this.buildRenderObject(this.props.getValues())});
    }

    render() {
        return <div className="preview">
            <div className="button-row">
            <Button bsStyle="info" onClick={this.submit}>Load Preview</Button>
            </div>
            <PDFPreview />
        </div>
    }
}

const Preview = connect<{}, {}, UnconnectedPreviewProps>((state: Jason.State, ownProps: UnconnectedPreviewProps) => ({
    getValues: () => ownProps.selector(state)
}), {
    render,
})(UnconnectedPreview as any);


export class TemplateViews extends React.PureComponent<{category: string, schema: string}> {
    render() {
        const { category, schema } = this.props;
        const name = `${category}.${schema}`;
        const type = templateSchemas[category].schemas[schema];
        return  <Grid fluid>
        <Col md={6}>
        <Tabs defaultActiveKey={2} id="tab-view">
            <Tab eventKey={1} title="Schema">
                <SchemaView schema={type.schema} />
            </Tab>
            <Tab eventKey={2} title="Form">
                <FormView schema={type.schema} validate={type.validate} name={name} />
            </Tab>
            {type.schema.wizard && <Tab eventKey={3} title="Wizard">
                <WizardView schema={type.schema} validate={type.validate} name={name} />
            </Tab> }
        </Tabs>
        </Col>
        <Col md={6}>
            <Preview category={category} schemaName={schema} form={name} selector={getFormValues(name)}/>
        </Col>
        </Grid>
    }
}

const InjectedTemplateViews = formValues<any>('category', 'schema')(TemplateViews);

class RenderDateTimePicker extends React.PureComponent<WrappedFieldProps & {formatDate: string}> {
    render() {

        const  { input: { onChange, value, onBlur }, formatDate} = this.props;
        const readFormats = [formatDate, "D M YYYY", "D MMM YYYY", "D/M/YYYY", "D-M-YYYY", "D MMMM YYYY"];
        return   <DateTimePicker
            onBlur={() => onBlur(undefined)}
            onChange={(date, string) => formatDate ? onChange(string) :  onChange(date)}
            parse={(string) => {
                const mo = moment(string, readFormats)
                return mo.isValid() ? mo.toDate() : null;
                }
            }
            format={this.props.formatDate}
            time={false}
            value={!value ? null : new Date(value)}
          />
    }
}

class SelectField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <FormControl {...this.props.input} componentClass="select">
            { this.props.children }
        </FormControl>
    }
}

class CheckboxField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <FormControl {...this.props.input} componentClass={'input'} type="checkbox" className="checkbox" />
    }
}

class TextField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <FormControl {...this.props.input} componentClass="input" />
    }
}

class TextAreaField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <FormControl {...this.props.input} componentClass="textarea" />
    }
}

class DateField extends React.PureComponent<WrappedFieldProps> {
    render() {
        return <FormControl {...this.props} {...this.props.input}  componentClass={RenderDateTimePicker}  />
    }
}

const SelectFieldRow = FieldRow(SelectField);
const TextFieldRow = FieldRow(TextField);
const TextAreaFieldRow = FieldRow(TextAreaField);
const DateFieldRow = FieldRow(DateField);
const CheckboxFieldRow = FieldRow(CheckboxField);


class SchemaField extends React.PureComponent<WrappedFieldProps & {category: string}> {
    render() {
        return <SelectField meta={this.props.meta} input={this.props.input}>
            { Object.keys(templateSchemas[this.props.category].schemas).map((key: string) => {
                return <option key={key} value={key}>{ templateSchemas[this.props.category].schemas[key].schema.title }</option>
            }) }
        </SelectField>
    }
}

const SchemaFieldWithCategory = formValues<any>('category')(SchemaField);


export class FormLoader extends React.PureComponent<InjectedFormProps> {
    render() {
        return <div>
        <h1 className="text-center"><img src="logo.png"/></h1>
        <Grid>
        <Form  horizontal>
            <FormGroup controlId="formControlsSelect">
                <Col sm={2}>
                    <ControlLabel>Category</ControlLabel>
                </Col>
                <Col sm={10}>
                    <Field name="category" component={SelectField as any}>
                        { Object.keys(templateSchemas).map((key: string) => {
                            return <option key={key} value={key}>{ key }</option>
                        }) }
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup controlId="formControlsSelect">
                <Col sm={2}>
                    <ControlLabel>Schema</ControlLabel>
                </Col>
                <Col sm={10}>
                    <Field name="schema" component={SchemaFieldWithCategory as any} />
                </Col>
            </FormGroup>
        </Form>
    </Grid>
        <InjectedTemplateViews />
    </div>
    }
}


export default reduxForm<{}>({
    form: 'formLoader'
})(FormLoader);

