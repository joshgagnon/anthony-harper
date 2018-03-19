import * as React from "react";
import FormLoader from './formLoader';
import * as moment from 'moment';
import Header from './header';
import Modals from './modals';
import * as momentLocalizer from 'react-widgets-moment';

momentLocalizer(moment);

export class App extends React.PureComponent<{}> {
    render() {
        return <div>
            <Header />
            <FormLoader initialValues={{category: 'Anthony Harper', schema: 'AEC-250770-98-449-1 LOE 2018 for Catalex'}} />
            <Modals />
        </div>

    }
}

export default App;
