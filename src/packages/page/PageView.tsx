import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import documentTitleBuilder from '../../utils/DocumentTitleBuilder';
import { Page } from './entities/Page';
import PageHeader from './components/PageHeader';
import PageMain from './components/PageMain';
import { SelectedPagePartType, SelectedPagePart, PagePartElementId } from './entities/SelectedPagePart';
import hotKeyListener, { keyCodeMap } from '../../utils/HotKeyListener';
import localizer from '../../utils/Localizer';
import CastError from '../shared/components/CastError';
import PageState from './state/PageState';
import { makeGetPage, makeGetPageError, makeGetPageLoading, makeGetSelectedPagePart } from './state/selectors';
import { PageError } from './entities/PageError';
import PageOptions from './components/PageOptions';

export interface PageViewProps { 
  pageId: string;
  page?: Page;
  loading?: boolean;
  pageError?: PageError;
  selectedPagePart?: SelectedPagePart;
}

const hotKeyCallbackNumbers: number[] = [];

const PageView: React.FunctionComponent<PageViewProps> = (props) => {
  useEffect(() => {
    PageState.setPage(props.pageId);
  }, [props.pageId]);

  useEffect(() => {
    hotKeyCallbackNumbers.push(
      hotKeyListener.registerCallback(
        new Set([keyCodeMap.ESC]), 
        handleCancelSelection,
      )
    );
    hotKeyCallbackNumbers.push(
      hotKeyListener.registerCallback(
        new Set([keyCodeMap.E]), 
        handleEditPagePart,
      )
    );
    hotKeyCallbackNumbers.push(
      hotKeyListener.registerCallback(
        new Set([keyCodeMap.SHIFT, keyCodeMap.COMMAND, keyCodeMap.S]), 
        handleSavePagePartChanges,
      )
    );
    hotKeyCallbackNumbers.push(
      hotKeyListener.registerCallback(
        new Set([keyCodeMap.F]), 
        handleJumpToPagePart,
      )
    );
    hotKeyCallbackNumbers.push(
      hotKeyListener.registerCallback(
        new Set([keyCodeMap.D]), 
        handleDeletePagePart,
      )
    );
    return function cleanup() {
      for (const callbackNumber of hotKeyCallbackNumbers) {
        hotKeyListener.unregisterCallback(callbackNumber);
      }
    };
  }, []);

  const setDocumentTitle = (page: Page) => {
    document.title = documentTitleBuilder.buildTitle([page.title]);
  }

  const handleDeletePagePart = () => {
    PageState.deletingSelectedPagePart();
  }

  const handleEditPagePart = () => {
    PageState.editingSelectedPagePart();
  }

  const handleJumpToPagePart = () => {
    PageState.jumpToSelectedPagePart();
  }

  const handleSavePagePartChanges = () => {
    PageState.saveSelectedPagePartChanges();
  }

  const handleCancelSelection = () => {
    PageState.deselectPagePart();
  }

  const getSelectedPagePart = ():SelectedPagePart => {
    if (!props.selectedPagePart) {
      return {
        type: SelectedPagePartType.Undefined,
        elementId: PagePartElementId.Undefined,
      };
    }
    return props.selectedPagePart;
  }

  const getErrorHtml = ():ReactElement => {
    const errorRetryCallback = () => {
      PageState.setPage(props.pageId);
    };
    const errorMessage = localizer.localeMap.page.error.fetchPage;
    return <CastError message={errorMessage} onRetry={errorRetryCallback}></CastError>;
  }

  if (!props.page) {
    return (
      <div className="PageView">
        {props.pageError && getErrorHtml()}
      </div>
    );
  }
  setDocumentTitle(props.page);

  return (
    <div className="PageView">
      <PageHeader page={props.page}></PageHeader>
      <PageMain
        page={props.page}
        selectedPagePart={getSelectedPagePart()}></PageMain>
      {!props.pageError && <PageOptions
        disabledSave={props.selectedPagePart?.disableSave}
        selectedPagePart={getSelectedPagePart()}></PageOptions>
      }
      {props.pageError && getErrorHtml()}
    </div>
  );
}

const makeMapStateToProps = () => {
  const getPage = makeGetPage();
  const getPageError = makeGetPageError();
  const getPageLoading = makeGetPageLoading();
  const getSelectedPagePart = makeGetSelectedPagePart();
  const mapStateToProps = (state: any) => {
    return {
      page: getPage(state),
      pageError: getPageError(state),
      loading: getPageLoading(state),
      selectedPagePart: getSelectedPagePart(state),
    };
  }
  return mapStateToProps;
}

export default connect(
  makeMapStateToProps,
)(PageView);
