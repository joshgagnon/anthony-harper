import * as React from "react";
import FormLoader from './formLoader';
import * as moment from 'moment';
import * as momentLocalizer from 'react-widgets-moment';
momentLocalizer(moment);

export class App extends React.PureComponent<{}> {
    render() {
        return <div>
            <FormLoader initialValues={{category: 'Anthony Harper', schema: 'AEC-250770-98-449-1 LOE 2018 for Catalex'}} />
        </div>

    }
}

export default App;
