/* eslint react/jsx-no-bind:0 */

/**
 * Fonio Application Component
 * =======================================
 *
 * Root component of the application.
 * @module fonio
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';

import './core.scss';
import './Application.scss';

import GlobalUi from './features/GlobalUi/components/GlobalUiContainer.js';
import StoryView from './features/StoryView/components/StoryViewContainer.js';
import StoriesManager from './features/StoriesManager/components/StoriesManagerContainer';

import {
    urlPrefix
} from '../secrets';

@connect(
  state => ({
    loadingBar: state.loadingBar.default,
  })
)
/**
 * Renders the whole fonio application
 * @return {ReactComponent} component
 */
export default class Application extends Component {

  /**
   * constructorstorestore
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
    this.confirmExit = this.confirmExit.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.confirmExit);
  }

  confirmExit(e) {
    const {loadingBar} = this.props;
    if (loadingBar > 0) {
      const confirmationMessage = '\o/';
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
      return confirmationMessage;
    }
  }
  render() {
    return (
      <Router basename={urlPrefix || '/'}>
        <div id="wrapper" className="fonio">
          <GlobalUi />
          <Switch>
            <Route exact path="/" component={StoriesManager} />
            <Route path="/story/:id/:mode?" render={(props) => (<StoryView {...props} />)} />
            <Route render={(props) => (
              // TODO: loading/error page
              <h2>
                No match for {props.location.pathname}, go back to <Link to="/">Home page</Link>
              </h2>
            )} />
          </Switch>
        </div>
      </Router>
    );
  }
}
