import { ValueText } from 'onecore';
import * as React from 'react';
import { SearchComponentState, useSearch, value } from 'react-hook-core';
import PageSizeSelect from 'react-page-size-select';
import { useHistory } from 'react-router-dom';
import Pagination from 'reactx-pagination';
import { inputSearch } from 'uione';
import { AuditLog, AuditLogFilter, useAuditLog} from './service';

interface AuditLogSearch extends SearchComponentState<AuditLog, AuditLogFilter> {
  statusList: ValueText[];
}

const auditLogfilter: AuditLogFilter = {
  id: '',
  action: '',
};

const AuditSearch: AuditLogSearch = {
  statusList: [],
  list: [],
  filter: auditLogfilter
};

export const AuditLogsForm = () => {
  const history = useHistory();
  const refForm = React.useRef();
  const hooks = useSearch<AuditLog, AuditLogFilter, AuditLogSearch>(refForm, AuditSearch, useAuditLog(), inputSearch());
  const { state, resource, component, updateState, pageSizeChanged, pageChanged } = hooks;

  const edit = (e: any, id: string) => {
    e.preventDefault();
    history.push('audit-logs/' + id);
  };
  const filter = value(state.filter);
  return (
    <div className='view-container'>
      <header>
        <h2>{resource.role_list}</h2>
      </header>
      <div>
        <form id='rolesForm' name='rolesForm' noValidate={true} ref={refForm as any}>
          <section className='row search-group inline'>
            <label className='col s12 m6'>
              Action
              <input
                type='text'
                id='action'
                name='action'
                value={filter.action}
                onChange={updateState}
                maxLength={240}
              />
            </label>
          </section>
          <section className='btn-group'>
            <label>
              {resource.page_size}
              <PageSizeSelect size={component.pageSize} sizes={component.pageSizes} onChange={pageSizeChanged} />
            </label>
            <button type='submit' className='btn-search' onClick={hooks.search}>{resource.search}</button>
          </section>
        </form>
        <form className='list-result'>
          <ul className='row list-view'>
            {state.list && state.list.length > 0 && state.list.map((item, i) => {
              return (
                <li key={i} className='col s12 m6 l4 xl3' onClick={e => edit(e, item.userId)}>
                  <section>
                    <div>
                      <h3>{item.userId}</h3>
                      <h4>{item.action}</h4>
                      <p>{item.remark}</p>
                    </div>
                  </section>
                </li>
              );
            })}
          </ul>
          <Pagination className='col s12 m6' total={component.total} size={component.pageSize} max={component.pageMaxSize} page={component.pageIndex} onChange={pageChanged} />
        </form>
      </div>
    </div>
  );
};
