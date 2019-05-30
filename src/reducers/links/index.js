import { COLLECTION_LINKS_SET } from '../../actions/collection/links/set';
import { COLLECTION_LINKS_SELECT } from '../../actions/collection/links/select';
import { COLLECTION_LINKS_ERROR } from '../../actions/collection/links/error';
import { COLLECTION_LINKS_START_LOADING } from '../../actions/collection/links/start-loading';
import { COLLECTION_LINKS_PUSH } from '../../actions/collection/links/push';
import { COLLECTION_LINKS_DELETE } from '../../actions/collection/links/delete';
import { ROUTE_TRANSITION_LINK_DETAIL } from '../../actions/route-transition/link-detail';
import { ROUTE_TRANSITION_LINK_LIST } from '../../actions/route-transition/link-list';

const initialState = {
  selected: null,
  loading: true,
  loadingSection: null,
  data: [],
  error: null,
  page: 0,
};

export default function links(state=initialState, action) {
  switch (action.type) {
  case COLLECTION_LINKS_SELECT:
  case ROUTE_TRANSITION_LINK_DETAIL:
    return {...state, selected: parseInt(action.id, 10), error: null};
  case ROUTE_TRANSITION_LINK_LIST:
    return {...state, error: null};
  case COLLECTION_LINKS_START_LOADING:
    return {...state, loading: true, loadingSection: action.item || 'whole-page'};
  case COLLECTION_LINKS_ERROR:
    return {...state, loading: false, error: action.error.message || action.error};

  // Collection operations:

  case COLLECTION_LINKS_SET:
    return {...state,
      data: action.data.map(item => {
        if (!item.upstream) {
          item.upstream = { type: 'repo', branches: [] };
        }
        if (!item.fork) {
          item.fork = { type: 'fork-all' };
        }
        return item;
      }),
      loading: false,
      loadingSection: null,
      page: action.page || 0,
    };
  case COLLECTION_LINKS_PUSH:
    const dataInState = state.data.find(item => action.item.id === item.id);
    return {
      ...state,
      loading: false,
      loadingSection: null,
      data: state.data.map(item => {
        // Update any old items.
        if (action.item.id === item.id) {
          return action.item;
        } else {
          return item;
        }
      }).concat(
        // Add the item if it's new.
        dataInState ? [] : [action.item]
      ),
    };
  case COLLECTION_LINKS_DELETE:
    return {
      ...state,
      loading: false,
      loadingSection: null,
      data: state.data.filter(item => {
        return action.item.id !== item.id;
      }),
    };
  default:
    return state;
  }
}
