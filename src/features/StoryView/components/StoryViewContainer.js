import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setLanguage} from 'redux-i18n';

import * as globalUiDuck from '../../GlobalUi/duck';
import * as managerDuck from '../../StoriesManager/duck';
import StoryViewLayout from './StoryViewLayout';


/**
 * Redux-decorated component class rendering the stories manager feature to the app
 */
@connect(
  state => ({
    ...globalUiDuck.selector(state.globalUi),
    ...managerDuck.selector(state.stories),
    lang: state.i18nState.lang
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...globalUiDuck,
      ...managerDuck,
      setLanguage
    }, dispatch)
  })
)
export default class StoryViewContainer extends Component {
  /**
   * Context data used by the component
   */
  static contextTypes = {

    /**
     * Un-namespaced translate function
     */
    t: PropTypes.func.isRequired,

    /**
     * Redux store
     */
    store: PropTypes.object.isRequired
  }

  /**
   * constructorstorestore
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {match, actions} = this.props;
    const {fetchStory, setActiveStory, openLoginModal} = actions;
    // TODO: optimize initialize story
    fetchStory(match.params.id).then(res => {
      if (res.result && res.result.data) {
        const isLogedIn = localStorage.getItem(match.params.id);
        if (match.params.mode === 'edit') {
          if (!isLogedIn)
            openLoginModal(match.params.id);
          else
            setActiveStory(res.result.data);
        }
      }
    });
  }

  componentWillReceiveProps (nextProps) {
    const {match, actions} = this.props;
    if (nextProps.match.params.mode !== match.params.mode) {
      const {openLoginModal} = actions;
      const isLogedIn = localStorage.getItem(nextProps.match.params.id);
      if (nextProps.match.params.mode === 'edit' && !isLogedIn) {
        openLoginModal(match.params.id);
      }
    }
  }

  shouldComponentUpdate() {
    return true;
  }
  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */

  render() {
    return (<StoryViewLayout {...this.props} />);
  }
}
