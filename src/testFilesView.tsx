/*
  Copyright (c) Microsoft Corporation.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import type { FilteredStats, HTMLReport, TestFileSummary } from './types';
import * as React from 'react';
import './testFileView.css';
import { Accordion, Paragraph } from '@amsterdam/design-system-react';
import { msToString } from '@isomorphic/formatUtils';
import { TestCaseTableView } from './testCaseTableView';
import { CodeSnippet } from './testErrorView';
import * as icons from './icons';
import { isMetadataEmpty, MetadataView } from './metadataView';
import { clsx } from '@web/uiUtils';
import { useTranslation } from './i18n';

export const TestFilesView: React.FC<{
  files: TestFileSummary[],
  expandedFiles: Map<string, boolean>,
  setExpandedFiles: (value: Map<string, boolean>) => void,
  projectNames: string[],
}> = ({ files, expandedFiles, setExpandedFiles, projectNames }) => {
  const { t } = useTranslation();

  if (files.length === 0)
    return <Paragraph>{t('report.noTestsFound')}</Paragraph>;

  return <Accordion headingLevel={3} sectionAs='section'>
    {files.map(file => {
      const stored = expandedFiles.get(file.fileId);
      // Accordion sections default to open; a stored preference overrides it.
      const isExpanded = stored === undefined ? true : stored;
      return <Accordion.Section
        key={`file-${file.fileId}`}
        label={file.fileName}
        defaultExpanded={isExpanded}
        onToggle={expanded => {
          const newExpanded = new Map(expandedFiles);
          newExpanded.set(file.fileId, expanded);
          setExpandedFiles(newExpanded);
        }}>
        <TestCaseTableView tests={file.tests} projectNames={projectNames} />
      </Accordion.Section>;
    })}
  </Accordion>;
};

export const TestFilesHeader: React.FC<{
  report: HTMLReport | undefined,
  filteredStats?: FilteredStats,
  metadataVisible: boolean,
  toggleMetadataVisible: () => void,
  errorsVisible: boolean,
  setErrorsVisible: (visible: boolean) => void,
}> = ({ report, filteredStats, metadataVisible, toggleMetadataVisible, errorsVisible, setErrorsVisible }) => {
  const { t } = useTranslation();

  if (!report)
    return null;

  const showProject = report.projectNames.length === 1 && !!report.projectNames[0];
  const isMetadataInTopLine = !showProject && !filteredStats;

  const metadataToggleButton = !isMetadataEmpty(report.metadata) && (
    <div className={clsx('metadata-toggle', !isMetadataInTopLine && 'metadata-toggle-second-line')} role='button' onClick={toggleMetadataVisible} title={metadataVisible ? 'Hide metadata' : 'Show metadata'}>
      {metadataVisible ? icons.downArrow() : icons.rightArrow()}Metadata
    </div>
  );

  const leftSuperHeader = <div className='test-file-header-info'>
    {showProject && <div data-testid='project-name'>Project: {report.projectNames[0]}</div>}
    {filteredStats && <div data-testid='filtered-tests-count'>Filtered: {filteredStats.total} {!!filteredStats.total && ('(' + msToString(filteredStats.duration) + ')')}</div>}
    {isMetadataInTopLine && metadataToggleButton}
  </div>;

  const rightSuperHeader = <>
    <div data-testid='overall-time' style={{ marginRight: '10px' }}>{report ? new Date(report.startTime).toLocaleString() : ''}</div>
    <div data-testid='overall-duration'>Total time: {msToString(report.duration ?? 0)}</div>
  </>;

  return <>
    {!isMetadataInTopLine && metadataToggleButton}
    {metadataVisible && <MetadataView metadata={report.metadata}/>}
    {!!report.errors.length && <Accordion headingLevel={3} sectionAs='section'>
      <Accordion.Section
        label={t('report.errors')}
        defaultExpanded={errorsVisible}
        onToggle={setErrorsVisible}
        data-testid='report-errors'>
        {report.errors.map((error, index) => <CodeSnippet key={'test-report-error-message-' + index} code={error}/>)}
      </Accordion.Section>
    </Accordion>}
  </>;
};
