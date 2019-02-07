import React, { Component } from "react";
import { observer } from "mobx-react";

import bookStore from "../stores/bookStore";

class BookForm extends Component {
  state = {
    title: "",
    color: ""
  };

  onTextChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitBook = async event => {
    event.preventDefault();
    await bookStore.addBook(this.state, this.props.author);
    if (!bookStore.errors) {
      this.props.closeModal();
    }
  };

  render() {
    return (
      <div className="mt-5">
        <form onSubmit={this.submitBook}>
          {bookStore.errors && (
            <div className="alert alert-danger" role="alert">
              {bookStore.errors.map(error => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Title</span>
            </div>
            <input
              type="text"
              className="form-control"
              name="title"
              onChange={this.onTextChange}
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Color</span>
            </div>
            <select
              name="color"
              className="form-control"
              onChange={this.onTextChange}
            >
              <option value="">----</option>
              <option value="white">White</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
              <option value="black">Black</option>
              <option value="grey">Grey</option>
              <option value="purple">Purple</option>
            </select>
          </div>
          <input type="submit" value="Add Book" />
        </form>
      </div>
    );
  }
}

export default observer(BookForm);
