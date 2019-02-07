import React, { Component } from "react";
import { observer } from "mobx-react";

import authorStore from "../stores/authorStore";

class AuthorForm extends Component {
  state = {
    first_name: "",
    last_name: "",
    imageUrl: "",
    books: []
  };

  onTextChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  submitAuthor = async event => {
    event.preventDefault();
    await authorStore.addAuthor(this.state);
    if (!authorStore.errors) {
      this.props.closeModal();
    }
  };

  render() {
    return (
      <div className="mt-5 p-2">
        <form onSubmit={this.submitAuthor}>
          {authorStore.errors && (
            <div className="alert alert-danger" role="alert">
              {authorStore.errors.map(error => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">First Name</span>
            </div>
            <input
              type="text"
              className="form-control"
              value={this.state.first_name}
              name="first_name"
              onChange={this.onTextChange}
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Last Name</span>
            </div>
            <input
              type="text"
              className="form-control"
              value={this.state.last_name}
              name="last_name"
              onChange={this.onTextChange}
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Image URL</span>
            </div>
            <input
              type="text"
              className="form-control"
              value={this.state.imageUrl}
              name="imageUrl"
              onChange={this.onTextChange}
            />
          </div>
          <input type="submit" />
        </form>
        <h5>{authorStore.statusMessage}</h5>
      </div>
    );
  }
}

export default observer(AuthorForm);
