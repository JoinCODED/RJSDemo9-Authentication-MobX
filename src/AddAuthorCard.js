import React, { Component } from "react";
import Modal from "react-responsive-modal";

import AuthorForm from "./forms/AuthorForm";

class AddAuthorCard extends Component {
  state = {
    open: false
  };

  onOpenModal = () => this.setState({ open: true });

  onCloseModal = () => this.setState({ open: false });

  render() {
    const { open } = this.state;
    return (
      <div className="col-lg-4 col-md-6 col-12">
        <div>
          <Modal open={open} onClose={this.onCloseModal} center>
            <AuthorForm closeModal={this.onCloseModal} />
          </Modal>
        </div>
        <div className="card" onClick={this.onOpenModal}>
          <div className="image">
            <img
              className="card-img-top img-fluid"
              src="https://mbtskoudsalg.com/images/a-plus-png-2.png"
              alt="+"
            />
          </div>
          <div className="card-body">
            <h5 className="card-title">
              <span>Add Author</span>
            </h5>
          </div>
        </div>
      </div>
    );
  }
}

export default AddAuthorCard;
