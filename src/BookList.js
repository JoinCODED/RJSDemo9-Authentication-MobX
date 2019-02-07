import React, { Component } from "react";
import { observer } from "mobx-react";

// Components
import SearchBar from "./SearchBar";
import BookTable from "./BookTable";

// Stores
import bookStore from "./stores/bookStore";

class BookList extends Component {
  render() {
    const bookColor = this.props.match.params.bookColor;
    let books = bookStore.filteredBooks;

    if (bookColor) {
      books = bookStore.getBooksByColor(bookColor);
    }

    return (
      <div>
        <h3>Books</h3>
        <SearchBar store={bookStore} />
        <BookTable books={books} />
      </div>
    );
  }
}

export default observer(BookList);
