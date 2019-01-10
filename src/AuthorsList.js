import React, { Component } from "react";
import { observer } from "mobx-react";

// Components
import AuthorCard from "./AuthorCard";
import SearchBar from "./SearchBar";
import AddAuthorCard from "./AddAuthorCard";

// Store
import authorStore from "./stores/authorStore";
import authStore from "./stores/authStore";

class AuthorsList extends Component {
  render() {
    const authorCards = authorStore.filteredAuthors.map(author => (
      <AuthorCard key={author.id} author={author} />
    ));

    return (
      <div>
        <h3>Authors</h3>
        <SearchBar store={authorStore} />
        <div className="row">
          {authStore.user && <AddAuthorCard />}
          {authorCards}
        </div>
      </div>
    );
  }
}

export default observer(AuthorsList);
