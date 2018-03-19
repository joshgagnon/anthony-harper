import * as React from 'react';
import Fade from 'react-bootstrap/lib/Fade';
import { Modal } from 'react-overlays';

export default class Loading extends React.PureComponent {
    render() {
        return <div className='loading' />;
    }
}



export function LoadingOverlay(props: any) {
    let animationTime = props.animationTime;
    if(props.animationTime === undefined){
        animationTime = 200;
    }
    return <Modal show={true} backdrop={true} className="basic-modal" backdropClassName="modal-backdrop" transition={animationTime ? Fade  as any: null} keyboard={false}>
        <div className="loading-modal" >
        <div className="message">{props.message || 'Loading'}</div>
            <Loading />
          </div>
    </Modal>
}