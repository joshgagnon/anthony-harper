import * as React from "react";
import FormLoader from './formLoader';


export class App extends React.PureComponent<{}> {
    render() {
        return <div>
            <FormLoader initialValues={{category: 'Anthony Harper', schema: 'AEC-250770-98-449-1 LOE 2018 for Catalex'}} />
        </div>

    }
}

export default App;
