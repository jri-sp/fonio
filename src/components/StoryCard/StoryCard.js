/**
 * This module provides a reusable story card component
 * @module fonio/components/StoryCard
 */
import React from 'react';
import PropTypes from 'prop-types';
import {translateNameSpacer} from '../../helpers/translateUtils';

import './StoryCard.scss';


/**
 * Renders the StoryCard component as a pure function
 * @param {object} props - used props (see prop types below)
 * @param {object} context - used context data (see context types below)
 * @return {ReactElement} component - the resulting component
 */
const StoryCard = ({
  story,
  promptedToDelete,
  // actions
  onClickEdit,
  onClickRead,
  onClickDelete,
  onClickPrompt,
  onClickUnprompt,
  onClickCopy,
  onClickResetPassword,
}, context) => {

  const translate = translateNameSpacer(context.t, 'Components.StoryCard');
  return (
    <li className="fonio-StoryCard">
      <div className="card-body">
        <div className="info-column">
          <h5>
            <span className="title">{story.metadata && story.metadata.title && story.metadata.title.length ? story.metadata.title : translate('untitled_story')}</span>
          </h5>
          <p className="description">
            {/*story.metadata && story.metadata.description && story.metadata.description.length ? story.metadata.description : translate('no_description')*/}
            <i>{story.metadata.authors.join(', ')}</i>
          </p>
        </div>
        <div className="buttons-column">
          <button className="edit-btn" onClick={onClickEdit}>
            <img src={require('../../sharedAssets/edit-white.svg')} className="fonio-icon-image" />
            {translate('edit')}
          </button>
          <button className="preview-btn" onClick={onClickRead}>
            <img src={require('../../sharedAssets/preview-black.svg')} className="fonio-icon-image" />
            {translate('read')}
          </button>
          <button className={'delete-btn ' + (promptedToDelete ? 'inactive' : '')} onClick={onClickPrompt}>
            <img src={require('../../sharedAssets/close-black.svg')} className="fonio-icon-image" />
            {translate('delete')}
          </button>
        </div>
      </div>
      <div className="card-footer">
        {promptedToDelete ?
          <div className="delete-prompt-container">
            {promptedToDelete ? <p>{translate('sure_delete')}</p> : null}
            <div className="button-row">
              <button className="delete-btn" onClick={onClickDelete}>
                {translate('delete_confirm')}
              </button>
              <button onClick={onClickUnprompt}>{translate('cancel')}</button>
            </div>
          </div> :
          <div>
            <button onClick={onClickCopy}>⎘ {translate('duplicate')}</button>
            <button onClick={onClickResetPassword}>
              {translate('change-password')}
            </button>
          </div> }
      </div>
    </li>
  );
};

/**
 * Component's properties types
 */
StoryCard.propTypes = {

  /**
   * Card's story data
   */
  story: PropTypes.object,

  /**
   * callbacks when story is selected by user
   */
  setToActive: PropTypes.func,

  /**
   * callbacks when story configuration is asked by user
   */
  configure: PropTypes.func,

  /**
   * represents if story deletion prompt ("are you sure...") is open
   */
  promptedToDelete: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),

  /**
   * callbacks when story deletion is asked by user
   */
  onClickDelete: PropTypes.func,

  /**
   * callbacks when delete prompt is asked by user
   */
  onClickPrompt: PropTypes.func,

  /**
   * callbacks when delete prompt is dismissed by user
   */
  onClickUnprompt: PropTypes.func,

  /**
   * callbacks when a section is asked to be duplicated
   */
  onClickCopy: PropTypes.func,

  /**
   * callbacks when user want to reset password
   */
  onClickResetPassword: PropTypes.func,

};


/**
 * Component's context used properties
 */
StoryCard.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};

export default StoryCard;
