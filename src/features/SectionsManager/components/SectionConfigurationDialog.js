/**
 * This module exports a stateless dialog component for editing a section
 * @module fonio/features/SectionsManager
 */

import React from 'react';
import PropTypes from 'prop-types';

import {translateNameSpacer} from '../../../helpers/translateUtils';

// import HelpPin from '../../../components/HelpPin/HelpPin';
import AuthorsManager from '../../../components/AuthorsManager/AuthorsManager';

import './SectionConfigurationDialog.scss';

/**
 * Renders a section configuration dialog as a pure function
 * @param {object} props - the props provided to the component
 * @param {object} context - used context data
 * @return {ReactElement} component - the component
 */
const SectionConfigurationDialog = ({
  sectionCandidate,
  sectionCandidateId,
  setSectionCandidateMetadataValue,
  onClose,
  createSection,
  updateSection
}, context) => {
  // namespacing the translating function with the feature name
  const translate = translateNameSpacer(context.t, 'Features.Editor');

  /**
   * Callbacks
   */
  const onApplyChange = () => {
    if (sectionCandidateId) {
      updateSection(sectionCandidateId, sectionCandidate);
    }
    else {
      createSection(sectionCandidate);
    }
  };
  const setSectionTitle = (e) => setSectionCandidateMetadataValue('title', e.target.value);
  const setSectionAuthors = authors => setSectionCandidateMetadataValue('authors', authors);
  return (
    <div className="fonio-SectionConfigurationDialog">
      <h1 className="modal-header">
        <span className="modal-header-title">{sectionCandidateId ? translate('edit-section') : translate('create-section')}</span>
        <button className="close-btn" onClick={onClose}>
          <img src={require('../../../sharedAssets/cancel-white.svg')} />
        </button>
      </h1>
      <section className="modal-content">
        <section className="modal-row">
          {/*<h2>{translate('section-metadata')}
            <HelpPin>
              {translate('section-metadata-help')}
            </HelpPin>
          </h2>*/}
          <div className="input-group">
            <label htmlFor="title">{translate('title-of-the-section')}</label>
            <input
              onChange={setSectionTitle}
              type="text"
              name="title"
              placeholder={translate('title-of-the-section')}
              value={sectionCandidate.metadata.title} />
          </div>
        </section>
        <section className="modal-row">
          <div className="input-group">
            <label htmlFor="authors">{translate('authors-of-the-section')}</label>
            <AuthorsManager
              onChange={setSectionAuthors}
              authors={sectionCandidate.metadata.authors} />
          </div>
        </section>

      </section>
      <section className="modal-footer">
        {
          sectionCandidate
          ?
            <button
              className="valid-btn"
              onClick={onApplyChange}>{sectionCandidateId ? translate('update-section') : translate('create-section')}</button>
          : ''
        }
      </section>
    </div>
  );
};


/**
 * Context data used by the component
 */
SectionConfigurationDialog.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};

export default SectionConfigurationDialog;
