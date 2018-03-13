import { prepareSchema, getValidate } from 'json-schemer';
import merge from 'deepmerge';
const schemas = require.context('anthony-harper-templates/schemas');

function loadAll(context: any) : {[key: string] : any}{
    const definitions = context('./definitions');
    return context.keys().reduce((acc: any, key: string) => {
        if(context(key) !== definitions && key.indexOf('.json') === -1){
            try{
                const schema = prepareSchema(definitions, context(key)) as Jason.Schema;
                const validate = getValidate(schema);
                acc[key.replace('./', '')] = {
                    schema,
                    validate
                }
            }
            catch(e){
                console.log('could not load schema: ', key)
            }
        }
        return acc;
    }, {});
}



const templateSchemas : Jason.TemplateSchemas = {
    'Anthony Harper': {
        schemas: loadAll(schemas),
        name: 'Anthony Harper'
    }
}

export default templateSchemas;
