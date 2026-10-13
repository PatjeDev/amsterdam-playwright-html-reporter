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

import type { TestCaseSummary } from './types';
import * as React from 'react';
import { ActionGroup, Icon, Link as AmsLink, Metadata, Table } from '@amsterdam/design-system-react';
import {
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from '@amsterdam/design-system-react-icons';
import { msToString } from '@isomorphic/formatUtils';
import { generateTraceUrl, testResultHref, useSearchParams } from './links';
import { ProjectAndTagLabelsView } from './labels';
import { image, video } from './icons';
import { formatUrl } from './utils';
import { useTranslation, type TranslationKey } from './i18n';
import './testFileView.css';

const outcomeIcon: Record<TestCaseSummary['outcome'], { className: string; icon: typeof SuccessIcon; labelKey: TranslationKey }> = {
  expected: { className: 'passed', icon: SuccessIcon, labelKey: 'outcome.passed' },
  unexpected: { className: 'failed', icon: ErrorIcon, labelKey: 'outcome.failed' },
  flaky: { className: 'flaky', icon: WarningIcon, labelKey: 'outcome.flaky' },
  skipped: { className: 'skipped', icon: InfoIcon, labelKey: 'outcome.skipped' },
};

export const TestCaseTableView: React.FC<{
  tests: TestCaseSummary[];
  projectNames: string[];
}> = ({ tests, projectNames }) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  return <Table>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>{t('col.outcome')}</Table.HeaderCell>
        <Table.HeaderCell>{t('col.test')}</Table.HeaderCell>
        <Table.HeaderCell>{t('col.labels')}</Table.HeaderCell>
        <Table.HeaderCell>{t('col.actions')}</Table.HeaderCell>
        <Table.HeaderCell align='end'>{t('col.duration')}</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {tests.map(test => {
        const href = testResultHref({ test }, searchParams);
        const outcome = outcomeIcon[test.outcome];
        const title = [...test.path, test.title].join(' › ');

        return <Table.Row key={`test-${test.testId}`}>
          <Table.Cell className='test-cell-middle'>
            <span className={outcome.className} role='img' aria-label={t(outcome.labelKey)} title={t(outcome.labelKey)}>
              <Icon svg={outcome.icon} />
            </span>
          </Table.Cell>
          <Table.Cell>
            <AmsLink href={href}>
              <span className='test-file-title'>{title}</span>
            </AmsLink>
            <Metadata className='test-file-path-row' size='small'>
              {test.location.file}:{test.location.line}
            </Metadata>
          </Table.Cell>
          <Table.Cell className='test-cell-middle'>
            <div className='test-file-badges'>
              <ProjectAndTagLabelsView projectNames={projectNames} activeProjectName={test.projectName} otherLabels={test.tags} />
              <ImageDiffBadge test={test} />
              <VideoBadge test={test} />
            </div>
          </Table.Cell>
          <Table.Cell className='test-cell-middle'>
            <ActionGroup>
              <AmsLink href={href}>{t('action.viewTestCase')}</AmsLink>
              <TraceActionLink test={test} label={t('action.viewTrace')} />
            </ActionGroup>
          </Table.Cell>
          <Table.Cell align='end' className='test-cell-middle'>
            <Metadata size='small'>{msToString(test.duration)}</Metadata>
          </Table.Cell>
        </Table.Row>;
      })}
    </Table.Body>
  </Table>;
};

function TraceActionLink({ test, label }: { test: TestCaseSummary; label: string }) {
  const firstTraces = test.results.map(result => result.attachments.filter(attachment => attachment.name === 'trace')).filter(traces => traces.length > 0)[0];
  if (!firstTraces)
    return null;
  return <AmsLink href={formatUrl(generateTraceUrl(firstTraces))}>{label}</AmsLink>;
}

function ImageDiffBadge({ test }: { test: TestCaseSummary }) {
  const searchParams = useSearchParams();
  for (const result of test.results) {
    for (const attachment of result.attachments) {
      if (attachment.contentType.startsWith('image/') && !!attachment.name.match(/-(expected|actual|diff)/))
        return <AmsLink href={testResultHref({ test, result, anchor: `attachment-${result.attachments.indexOf(attachment)}` }, searchParams)} title='View images' aria-label='View images'>{image()}</AmsLink>;
    }
  }
}

function VideoBadge({ test }: { test: TestCaseSummary }) {
  const searchParams = useSearchParams();
  const resultWithVideo = test.results.find(result => result.attachments.some(attachment => attachment.name === 'video'));
  return resultWithVideo ? <AmsLink href={testResultHref({ test, result: resultWithVideo, anchor: 'attachment-video' }, searchParams)} title='View video' aria-label='View video'>{video()}</AmsLink> : undefined;
}
