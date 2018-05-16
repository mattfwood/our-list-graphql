import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { DRAFTS_QUERY } from './DraftsPage';
import { FEED_QUERY } from './FeedPage';

class DetailPage extends Component {
  state = {
    newItem: '',
  };

  addItem = async (e, addItem) => {
    e.preventDefault();

    const { newItem } = this.state;
    const listId = this.props.match.params.id;

    console.log(this.props);

    // await addItem({
    //   variables: {
    //     newItem,
    //     listId: listId
    //   }
    // })
  }

  render() {
    return (
      <Query query={LIST_QUERY} variables={{ id: this.props.match.params.id }}>
        {({ data, loading, error }) => {
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

          const { list } = data;
          const action = this._renderAction(list);
          return (
            <Grid>
              <Row>
                <Col md={6} mdOffset={3} xs={12}>
                  <h1>{list.title}</h1>
                  <div className="list-item-container">
                    {list.items.map(item => (
                      <div className="list-item">{item.text}</div>
                    ))}
                  </div>
                  <form className="new-list-item" onSubmit={e => this.addItem(e)}>
                    <input
                      type="text"
                      value={this.state.newItem}
                      className="pa2 mv2 br2 b--black-20 bw1 w-100"
                      placeholder="Add Item"
                      onChange={input =>
                        this.setState({ newItem: input.target.value })
                      }
                    />
                    <input class="bn add-list-button " disabled={!this.state.newItem} type="submit" value="Add" />
                  </form>
                  {action}
                </Col>
              </Row>
            </Grid>
          );
        }}
      </Query>
    );
  }

  _renderAction = ({ id }) => {
    const deleteMutation = (
      <Mutation
        mutation={DELETE_MUTATION}
        update={(cache, { data }) => {
          const { feed } = cache.readQuery({ query: FEED_QUERY });
          cache.writeQuery({
            query: FEED_QUERY,
            data: {
              listFeed: feed.filter(list => list.id !== data.deleteList.id),
            },
          });
        }}
      >
        {(deleteList, { data, loading, error }) => {
          return (
            <a
              className="f6 dim br1 ba ph3 pv2 mb2 dib black pointer"
              onClick={async () => {
                await deleteList({
                  variables: { id },
                });
                this.props.history.replace('/');
              }}
            >
              Delete
            </a>
          );
        }}
      </Mutation>
    );
    return deleteMutation;
  };
}

const LIST_QUERY = gql`
  query ListQuery($id: ID!) {
    list(id: $id) {
      id
      title
      items {
        id
        text
      }
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation DeleteMutation($id: ID!) {
    deleteList(id: $id) {
      id
    }
  }
`;

const ADD_ITEM_MUTATION = gql`
  mutation AddItem($listId: ID!, $text: String!) {
    addItemToList(listId: $listId, text: $text) {
      id
      title
      items {
        id
        text
      }
    }
  }
`

export default withRouter(DetailPage);