/**
 * This module exports logic-related elements for the management of (locally stored) fonio stories
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module fonio/features/PresentationsManager
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {persistentReducer} from 'redux-pouchdb';
import {v4 as uuid} from 'uuid';

import {serverUrl} from '../../../secrets';
/*
 * Action names
 */
import {
  START_CANDIDATE_STORY_CONFIGURATION,
  APPLY_STORY_CANDIDATE_CONFIGURATION,
  UNSET_ACTIVE_STORY,
  SET_ACTIVE_STORY,
} from '../Editor/duck';

import {
  EXPORT_TO_GIST,
  EXPORT_TO_SERVER
} from '../TakeAwayDialog/duck';

const CREATE_STORY = '§Fonio/PresentationsManager/CREATE_STORY';
const DELETE_STORY = '§Fonio/PresentationsManager/DELETE_STORY';
const UPDATE_STORY = '§Fonio/PresentationsManager/UPDATE_STORY';
const COPY_STORY = '§Fonio/PresentationsManager/COPY_STORY';

const PROMPT_DELETE_STORY = '§Fonio/PresentationsManager/PROMPT_DELETE_STORY';
const UNPROMPT_DELETE_STORY = '§Fonio/PresentationsManager/UNPROMPT_DELETE_STORY';

const IMPORT_ABORD = '§Fonio/PresentationsManager/IMPORT_ABORD';
const IMPORT_OVERRIDE_PROMPT = '§Fonio/PresentationsManager/IMPORT_OVERRIDE_PROMPT';
const IMPORT_FAIL = '§Fonio/PresentationsManager/IMPORT_FAIL';
const IMPORT_SUCCESS = '§Fonio/PresentationsManager/IMPORT_SUCCESS';
const IMPORT_RESET = '§Fonio/PresentationsManager/IMPORT_RESET';
const SET_IMPORT_FROM_URL_CANDIDATE = '§Fonio/PresentationsManager/SET_IMPORT_FROM_URL_CANDIDATE';

/*
 * Action creators
 */
/**
 * @param {string} id - the uuid of the story to create
 * @param {object} story - the data of the story to create
 * @param {boolean} setActive - whether to set the story as active (edited) story in app
 */
export const createPresentation = (id, story, setActive = true) => ({
  type: CREATE_STORY,
  story,
  setActive,
  id
});
/**
 * @param {object} story - the data of the story to copy
 */
export const copyPresentation = (story) => ({
  type: COPY_STORY,
  story
});
/**
 * @param {string} id - the uuid of the story to query for deletion
 */
export const promptDeletePresentation = (id) => ({
  type: PROMPT_DELETE_STORY,
  id
});
/**
 *
 */
export const unpromptDeletePresentation = () => ({
  type: UNPROMPT_DELETE_STORY
});
/**
 * @param {string} id - the uuid of the story to delete
 */
export const deletePresentation = (id) => ({
  type: DELETE_STORY,
  id
});
/**
 * @param {string} id - the uuid of the story to update
 * @param {object} story - the data of the story to update
 */
export const updatePresentation = (id, story) => ({
  type: UPDATE_STORY,
  id,
  story
});
/**
 *
 */
export const importReset = () => ({
  type: IMPORT_RESET
});
/**
 *
 */
export const abordImport = () => ({
  type: IMPORT_ABORD
});
/**
 * @param {object} candidate - the data of the story waiting to be imported or not instead of existing one
 */
export const promptOverrideImport = (candidate) => ({
  type: IMPORT_OVERRIDE_PROMPT,
  candidate
});
/**
 * @param {object} data - the data of the imported story
 */
export const importSuccess = (data) => (dispatch) => {
  dispatch({
    type: IMPORT_SUCCESS,
    data
  });
  // resets import state after a while
  setTimeout(() => dispatch(importReset()), 5000);
};
/**
 * @param {string} error - the error type for the import failure
 */
export const importFail = (error) => (dispatch) => {
  dispatch({
    type: IMPORT_FAIL,
    error
  });
  // resets import state after a while
  setTimeout(() => dispatch(importReset()), 5000);
};
/**
 * @param {string}  value - the new value to set for import from url candidate
 */
 export const setImportFromUrlCandidate = (value) => ({
  type: SET_IMPORT_FROM_URL_CANDIDATE,
  value
 });

/*
 * Reducers
 */
const STORIES_DEFAULT_STATE = {
  /**
   * Restory of all the stories stored in application's state
   * @type {object}
   */
  stories: {},
  /**
   * Restory of the id of the story being edited in editor
   * @type {string}
   */
  activePresentationId: undefined
};
/**
 * This redux reducer handles the modification of the data state for the stories stored in the application's state
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 */
function stories(state = STORIES_DEFAULT_STATE, action) {
  switch (action.type) {
    case APPLY_STORY_CANDIDATE_CONFIGURATION:
      if (state.activePresentationId) {
        // case update
        return {
          ...state,
          stories: {
            ...state.stories,
            [action.story.id]: {
              ...state.stories[action.story.id],
              ...action.story
            }
          },
          activePresentationId: action.story.id
        };
      }
      else {
        // case create
        return {
          ...state,
          stories: {
            ...state.stories,
            [action.story.id]: action.story
          },
          activePresentationId: action.story.id
        };
      }
    case SET_ACTIVE_STORY:
      return {
        ...state,
        activePresentationId: action.story.id
      };
    case UNSET_ACTIVE_STORY:
      return {
        ...state,
        activePresentationId: undefined
      };
    case CREATE_STORY:
      const id = action.id;
      let story = {
        ...action.story,
        id
      };
      return {
        ...state,
        stories: {
          ...state.stories,
          [id]: story
        }
      };
    case DELETE_STORY:
      const newState = Object.assign({}, state);
      delete newState.stories[action.id];
      return newState;
    case UPDATE_STORY:
      return {
        ...state,
        stories: {
          ...state.stories,
          [action.id]: action.story
        }
      };
    case IMPORT_SUCCESS:
      story = action.data;
      return {
        ...state,
        stories: {
          ...state.stories,
          [story.id]: {
            ...story
          }
        }
      };
    case COPY_STORY:
      const original = action.story;
      const newId = uuid();
      const newPresentation = {
        ...original,
        id: newId,
        metadata: {
          ...original.metadata,
          title: original.metadata.title + ' - copy'
        }
      };
      return {
        ...state,
        stories: {
          ...state.stories,
          [newId]: newPresentation
        }
      };
    /*
     * EXPORT-RELATED
     */
    case EXPORT_TO_GIST + '_SUCCESS':
      return {
        ...state,
        stories: {
          ...state.stories,
          [state.activePresentationId]: {
            ...state.stories[state.activePresentationId],
            metadata: {
              ...state.stories[state.activePresentationId].metadata,
              gistUrl: action.result.gistUrl,
              gistId: action.result.gistId
            }
          }
        }
      };
    case EXPORT_TO_SERVER + '_SUCCESS':
      return {
        ...state,
        stories: {
          ...state.stories,
          [state.activePresentationId]: {
            ...state.stories[state.activePresentationId],
            metadata: {
              ...state.stories[state.activePresentationId].metadata,
              serverJSONUrl: serverUrl + '/stories/' + state.stories[state.activePresentationId].id,
              serverHTMLUrl: serverUrl + '/stories/' + state.stories[state.activePresentationId].id + '?format=html'
            }
          }
        }
      };
    default:
      return state;
  }
}

const STORIES_UI_DEFAULT_STATE = {
  /**
   * Restory of the id of the story being edited in editor
   * @type {string}
   */
  activePresentationId: undefined,
  /**
   * Restory of the id of the item being prompted to delete
   * @type {string}
   */
  promptedToDelete: undefined
};
/**
 * This redux reducer handles the modification of the ui state for stories management
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 */
function storiesUi(state = STORIES_UI_DEFAULT_STATE, action) {
  switch (action.type) {
    case START_CANDIDATE_STORY_CONFIGURATION:
      return {
        activePresentationId: action.id
      };
    case CREATE_STORY:
      return {
        ...state,
        activePresentationId: action.setActive ? action.id : state.activePresentationId
      };
    case PROMPT_DELETE_STORY:
      return {
        ...state,
        promptedToDelete: action.id
      };
    case UNPROMPT_DELETE_STORY:
      return {
        ...state,
        promptedToDelete: undefined
      };
    case DELETE_STORY:
      return {
        ...state,
        promptedToDelete: undefined,
        activePresentationId: state.activePresentationId === action.id ? undefined : state.activePresentationId
      };
    default:
      return state;
  }
}


const STORY_IMPORT_DEFAULT_STATE = {
  /**
   * Restory of a story waiting to be imported or not
   * @type {object}
   */
  importCandidate: undefined,
  /**
   * Restory of the import state
   * @type {object}
   */
  importStatus: undefined,
  /**
   * Restory of the import error occured after an import failed
   * @type {string}
   */
  importError: undefined,
  /**
   * Restory of the content of import from url input
   * @type {string}
   */
  importFromUrlCandidate: ''
};
/**
 * This redux reducer handles the modifications related to importing stories in application's state
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 */
function storyImport(state = STORY_IMPORT_DEFAULT_STATE, action) {
  switch (action.type) {
    case IMPORT_RESET:
      return STORY_IMPORT_DEFAULT_STATE;
    case IMPORT_FAIL:
      return {
        ...state,
        importStatus: 'failure',
        importError: action.error
      };
    case IMPORT_SUCCESS:
      return {
        ...STORIES_DEFAULT_STATE,
        importStatus: 'success'
      };
    case IMPORT_OVERRIDE_PROMPT:
      return {
        ...state,
        importCandidate: action.candidate
      };
    case SET_IMPORT_FROM_URL_CANDIDATE:
      return {
        ...state,
        importFromUrlCandidate: action.value
      };
    default:
      return state;
  }
}
/**
 * The module exports a reducer connected to pouchdb thanks to redux-pouchdb
 */
export default persistentReducer(
  combineReducers({
      stories,
      storiesUi,
      storyImport
  }),
  'fonio-stories'
);

/*
 * Selectors
 */
const storiesList = state => Object.keys(state.stories.stories).map(key => state.stories.stories[key]);
const activePresentation = state => state.stories.stories[state.stories.activePresentationId];
const activePresentationId = state => state.stories.activePresentationId;

const promptedToDeleteId = state => state.storiesUi.promptedToDelete;
const importStatus = state => state.storyImport.importStatus;
const importError = state => state.storyImport.importError;
const importCandidate = state => state.storyImport.importCandidate;
const importFromUrlCandidate = state => state.storyImport.importFromUrlCandidate;
/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  activePresentation,
  activePresentationId,

  importCandidate,
  importError,
  importStatus,
  importFromUrlCandidate,

  storiesList,
  promptedToDeleteId,
});

