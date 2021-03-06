
/**
 * This module exports a stateless component rendering the layout of the resources manager feature interface
 * @module fonio/features/ResourcesManager
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';


import {translateNameSpacer} from '../../../helpers/translateUtils';
import ResourceCard from '../../../components/ResourceCard/ResourceCard';
import OptionSelect from '../../../components/OptionSelect/OptionSelect';
import DropZone from '../../../components/DropZone/DropZone';
import Toaster from '../../../components/Toaster/Toaster';

import ResourceConfigurationDialog from './ResourceConfigurationDialog';
import './ResourcesManagerLayout.scss';

Modal.setAppElement('#mount');


/**
 * Renders the resources manager layout
 * @param {object} props - the props to render
 * @return {ReactElement} markup
 */
const ResourcesManagerLayout = ({
  resourceCandidate,
  resourceCandidateId,
  resourceCandidateType,
  resourceDataLoadingState,
  resourceUploadingState,
  resources,
  resourcesModalState = 'closed',
  resourcesPrompted,
  resourcesSearchQuery,
  resourcesTypeQuery,
  createResource,
  updateResource,
  deleteResource,
  setCoverImage,
  resourcePromptedToDelete,
  contextualizeAfterResourceCreation,
  actions: {
    setResourceCandidateMetadataValue,
    setResourceCandidateType,
    setResourcesModalState,
    setResourcesSearchQuery,
    setResourcesTypeQuery,
    startExistingResourceConfiguration,
    startNewResourceConfiguration,
    submitResourceData,
    // unpromptAssetEmbed,
    setEditorFocus,
    requestDeletePrompt,
    abortDeletePrompt,
  },
  // custom functions
  embedAsset,
  embedLastResource,
  onDropFiles,
  dropFilesStatus,
  dropFilesLog,
  // custom props
  style,
}, context) => {
  // namespacing the translation keys with feature id
  const translate = translateNameSpacer(context.t, 'Features.ResourcesManager');
  const translateResources = translateNameSpacer(context.t, 'Features.Editor');
  const resourcesTypes = [
    {
      value: '',
      label: translate('all-types')
    },
    // {
    //   value: 'data-presentation',
    //   label: translateResources('resource-type-data-presentation')
    // },
    {
      value: 'table',
      label: translateResources('resource-type-table')
    },
    {
      value: 'image',
      label: translateResources('resource-type-image')
    },
    {
      value: 'video',

      label: translateResources('resource-type-video')
    },
    {
      value: 'webpage',
      label: translateResources('resource-type-webpage')
    },
    {
      value: 'embed',
      label: translateResources('resource-type-embed')
    },
    {
      value: 'glossary',
      label: translateResources('resource-type-glossary')
    },
    {
      value: 'bib',
      label: translateResources('resource-type-bib')
    },
  ];
  /**
   * Callbacks
   */
  const onModalClose = () => setResourcesModalState('closed');
  const onSearchInputChange = (e) => {
    setResourcesSearchQuery(e.target.value);
  };
  const onSelectResourceType = (value) => {
    setResourcesTypeQuery(value);
  };
  return (
    <div
      className={'fonio-ResourcesManagerLayout ' + (resourcesPrompted ? 'resources-prompted' : '')}
      style={style}>
      {

        resourcesPrompted && (
          <div className="asset-select-help">
            {resources.length > 0 ?
              <h3>{translate('click-on-a-resource-to-embed')}</h3> :
              <div>
                <h3>{translate('you-must-first-add-resources-to-embed')}</h3>
                {/*<button className="understood-btn" onClick={unpromptAssetEmbed}>{translate('understood')}</button>*/}
              </div>}
          </div>
        )

      }
      <li id="new-resource" onClick={() => startNewResourceConfiguration(resourcesPrompted === true)}>
        <span className="fonio-icon">
          <img
            src={require('../../../sharedAssets/close-white.svg')}
            style={{transform: 'rotate(45deg)'}} />
        </span>
        <span>{translate('new-resource')}</span>
      </li>
      <ul className="body">
        {
        resources
        .sort((a, b) => {
          if (a.metadata.createdAt > b.metadata.createdAt) {
            return -1;
          }
          if (a.metadata.createdAt < b.metadata.createdAt) {
            return 1;
          }
          return 0;
        })
        .map((resource, index) => {
          const onRequestDeletePrompt = () => {
            requestDeletePrompt(resource.id);
          };
          const onAbortDeletePrompt = () => {
            abortDeletePrompt();
          };
          const onDelete = () => deleteResource(resource);
          const onEdit = () => startExistingResourceConfiguration(resource.id, resource);
          const onSetCoverImage = () => setCoverImage(resource.id);
          const onEmbedResource = () => {
            embedAsset(resource.id);
          };
          const onMouseDown = () => {
            setEditorFocus(undefined);
          };

          return (
            <ResourceCard
              key={index}
              onMouseDown={onMouseDown}
              onDelete={onDelete}
              onConfigure={onEdit}
              onRequestDeletePrompt={onRequestDeletePrompt}
              onAbortDeletePrompt={onAbortDeletePrompt}
              onSetCoverImage={onSetCoverImage}
              promptedToDelete={resourcePromptedToDelete === resource.id}
              selectMode={resourcesPrompted}
              onSelect={onEmbedResource}
              style={{
                cursor: 'move',
              }}
              {...resource} />
          );
        })
      }
        <li
          className="batch-drop-container">
          <Toaster status={dropFilesStatus} log={dropFilesLog} />
          <DropZone
            onDrop={onDropFiles} accept="image/png, image/jpeg, image/gif, .bib, .csv, .tsv">
            <h3>
              {translate('drop-files-here')}
              <span
                className={'fonio-HelpPin'}>
                <span className="pin-icon">
                  ?
                </span>
              </span>
            </h3>
            <div className="details-container">
              <p>{translate('resources-drop-help-intro')}</p>
              <ul>
                <li>
                  {translate('resource-drop-help-image')}
                </li>
                <li>
                  {translate('resource-drop-help-table')}
                </li>
                <li>
                  {translate('resource-drop-help-bib')}
                </li>
              </ul>
            </div>
          </DropZone>
        </li>
      </ul>
      <div className="footer">
        {resources.length > 1 && <input
          className="search-query"
          type="text"
          placeholder={translate('search-in-resources')}
          value={resourcesSearchQuery || ''}
          onChange={onSearchInputChange} />}
        <OptionSelect
          activeOptionId={resourcesTypeQuery}
          options={resourcesTypes}
          onChange={onSelectResourceType}
          title={translate('resource-type')} />
      </div>

      <Modal
        isOpen={resourcesModalState !== 'closed'}
        contentLabel={translate('edit-resource')}
        onRequestClose={onModalClose}>
        <ResourceConfigurationDialog
          resourceCandidate={resourceCandidate}
          resourceCandidateId={resourceCandidateId}
          resourceCandidateType={resourceCandidateType}
          contextualizeAfterResourceCreation={contextualizeAfterResourceCreation}
          embedLastResource={embedLastResource}
          onClose={onModalClose}
          setResourceCandidateType={setResourceCandidateType}
          setResourceCandidateMetadataValue={setResourceCandidateMetadataValue}
          submitResourceData={submitResourceData}
          resourceDataLoadingState={resourceDataLoadingState}
          resourceUploadingState={resourceUploadingState}
          createResource={createResource}
          updateResource={updateResource} />
      </Modal>
    </div>
  );
};


/**
 * Context data used by the component
 */
ResourcesManagerLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};

export default ResourcesManagerLayout;
