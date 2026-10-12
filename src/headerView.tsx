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

import type { Stats } from './types';
import * as React from 'react';

import './colors.css';
import './common.css';
import './headerView.css';

import { useSearchParams } from './links';
import { linkifyText } from '@web/renderUtils';

import {
  SearchField,
  TabNavigation,
} from '@amsterdam/design-system-react';

import {
  ClockIcon,
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from '@amsterdam/design-system-react-icons';
import { filterWithQuery } from './filter';
import { useTranslation } from './i18n';

export const HeaderView: React.FC<{
  title: string | undefined,
  leftSuperHeader?: React.ReactNode,
  rightSuperHeader?: React.ReactNode,
}> = ({
  title,
  leftSuperHeader,
  rightSuperHeader,
}) => {
  return (
    <div className='header-view'>
      <div className='hbox header-superheader'>
        {leftSuperHeader}

        <div style={{ flex: 'auto' }} />

        {rightSuperHeader}
      </div>

      {title && (
        <div className='header-title'>
          {linkifyText(title)}
        </div>
      )}
    </div>
  );
};

export const GlobalFilterView: React.FC<{
  stats: Stats,
  filterText: string,
  setFilterText: (filterText: string) => void,
}> = ({
  stats,
  filterText,
  setFilterText,
}) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  /*
   * Keep the search input synchronized with the q parameter
   * stored in the hash.
   */
  React.useEffect(() => {
    setFilterText(query ? `${query.trim()} ` : '');
  }, [query, setFilterText]);

  /*
   * SearchField renders its own <form>, so do not wrap it in
   * another <form>. The application uses the URL hash for filters:
   *
   *   #?                         -> all
   *   #?q=s%3Apassed             -> passed
   *   #?q=s%3Afailed             -> failed
   *   #?q=s%3Aflaky              -> flaky
   *   #?q=s%3Askipped            -> skipped
   *   #?speedboard               -> speedboard
   *
   * The normal URL query string is deliberately not used.
   */
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const value = String(formData.get('q') ?? '').trim();

    window.location.hash = value
      ? `?q=${encodeURIComponent(value)}`
      : '';
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    setFilterText(value);

    /*
     * The native clear button on <input type="search"> fires onChange,
     * but does not submit the form.
     *
     * Remove q immediately when the input is cleared.
     */
    if (!value.trim()) {
      window.location.hash = '';
    }
  };

  return (
    <div className='subnav-search'>
      <SearchField
        onSubmit={handleSearchSubmit}
      >
        <SearchField.Input
          placeholder={t('report.search')}
          name='q'
          value={filterText}
          onChange={handleSearchChange}
        />

        <SearchField.Button />
      </SearchField>

      <StatsNavView stats={stats} />
    </div>
  );
};

const StatsNavView: React.FC<{
  stats: Stats,
}> = ({ stats }) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const status = searchParams.get('q');
  const isSpeedboard = searchParams.has('speedboard');

  const isAll = !isSpeedboard && !status;

  return (
    <TabNavigation>
      <TabNavigation.List>
        <TabNavigation.Link
          aria-current={isAll ? 'page' : undefined}
          href='#?'
          count={stats.total - stats.skipped}
        >
          {t('report.all')}
        </TabNavigation.Link>

        <TabNavigation.Link
          aria-current={status === 's:passed' ? 'page' : undefined}
          href='#?q=s%3Apassed'
          icon={SuccessIcon}
          className='passed'
          count={stats.expected}
        >
          {t('outcome.passed')}
        </TabNavigation.Link>

        <TabNavigation.Link
          aria-current={status === 's:failed' ? 'page' : undefined}
          href='#?q=s%3Afailed'
          icon={ErrorIcon}
          className='failed'
          count={stats.unexpected}
        >
          {t('outcome.failed')}
        </TabNavigation.Link>

        <TabNavigation.Link
          aria-current={status === 's:flaky' ? 'page' : undefined}
          href='#?q=s%3Aflaky'
          icon={WarningIcon}
          className='flaky'
          count={stats.flaky}
        >
          {t('outcome.flaky')}
        </TabNavigation.Link>

        <TabNavigation.Link
          aria-current={status === 's:skipped' ? 'page' : undefined}
          href='#?q=s%3Askipped'
          icon={InfoIcon}
          className='skipped'
          count={stats.skipped}
        >
          {t('outcome.skipped')}
        </TabNavigation.Link>

        <TabNavigation.Link
          aria-current={isSpeedboard ? 'page' : undefined}
          href='#?speedboard'
          icon={ClockIcon}
        >
          {t('report.speedboard')}
        </TabNavigation.Link>
      </TabNavigation.List>
    </TabNavigation>
  );
};

const preventDefault = (e: any) => {
  e.stopPropagation();
  e.preventDefault();
};
