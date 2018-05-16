import React, { Component, Fragment } from 'react';
import Post from '../components/Post';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import CreatePage from './CreatePage';
import ListPreview from './ListPreview';

export default class FeedPage extends Component {
  render() {
    return (
      <Query query={FEED_QUERY}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                <div>Loading ...</div>
              </div>
            );
          }

          if (error) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                <div>An unexpected error occured.</div>
              </div>
            );
          }

          console.log(data);

          return (
            <Fragment>
              <h1>Lists</h1>
              <CreatePage />
              {data.listFeed &&
                data.listFeed.map(list => (
                  <ListPreview list={list} />
                ))}
              {this.props.children}
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

export const FEED_QUERY = gql`
  query FeedQuery {
    listFeed {
      id
      title
      items {
        text
      }
    }
  }
`;
