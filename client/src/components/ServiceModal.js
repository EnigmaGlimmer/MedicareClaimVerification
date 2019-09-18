import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

class ServiceModal extends React.Component {
  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.props.toggle}>Create Service Claim</ModalHeader>
          <ModalBody>
            Please enter the name for the service.
            <Input onChange={this.props.updateServiceClaimName} placeholder="Name of Service"/>
          </ModalBody>
          <ModalFooter>
          <Input onChange={this.props.updateAmount} placeholder="Amount"/>
            <Button color="success" onClick={this.props.provideService}>Create</Button>{' '}
            <Button color="danger" onClick={this.props.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ServiceModal;