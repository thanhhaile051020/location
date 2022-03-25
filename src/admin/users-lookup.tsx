import * as React from 'react';
import { SearchComponent, SearchState, value, SearchComponentState, useSearch } from 'react-hook-core';
import * as ReactModal from 'react-modal';
import PageSizeSelect from 'react-page-size-select';
import { RouteComponentProps } from 'react-router';
import Pagination from 'reactx-pagination';
import { initForm, inputSearch, registerEvents, storage } from 'uione';
import { User, UserFilter, useUser } from './service';
import { ValueText } from 'onecore';

interface Props extends RouteComponentProps {
  isOpenModel: boolean;
  users: User[];
  onModelClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onModelSave: (e: User[]) => void;
  props?: any;
}

interface UserSearch extends SearchComponentState<User, UserFilter> {
  statusList: ValueText[];
  users: any[];
  availableUsers: any[];
  filter:UserFilter;
  list: any[];
  model: {
    q: string;
    userId: string;
    username: string;
    email: string;
    status: any[];
  };
}
const userFilter: UserFilter = {
  userId: '',
  username: '',
  displayName: '',
  email: '',
  status: []
};
const initialState: UserSearch = {
  statusList: [],
  list: [],
  filter: userFilter,
  users: [],
  model: {
    q: '',
    userId: '',
    username: '',
    email: '',
    status: []
  },
  availableUsers: [],
};
// props onModelSave onModelClose isOpenModel users?=[]
export const UsersLookup = (props: Props) => {
  const refForm = React.useRef();
  const { state, setState, resource, component, search, sort, pageChanged, pageSizeChanged } = useSearch<User, UserFilter, UserSearch>(refForm, initialState, useUser(), inputSearch());
  const { isOpenModel } = props;
  const users = props.users ? props.users : [];
  const { list } = state;
  const filter = value(state.model);
  let index = 0;

  const onCheckUser = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const listState = state.list;
    const usersState = state.users;
    const target: HTMLInputElement = e.target as HTMLInputElement;
    const result = (listState ? listState.find(v => v.userId === target.value) : undefined);
    if (result) {
      const indexCheck = usersState.indexOf(result);
      if (indexCheck !== -1) {
        delete usersState[indexCheck];
      } else {
        usersState.push(result);
      }
      setState({ users: usersState });
    }
  }

  const onModelSave = () => {
    setState({ users: [], availableUsers: [], model: { ...state.model, q: '' } });
    props.onModelSave(state.users);
  }

  const onModelClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    setState({ users: [], availableUsers: [], model: { ...state.model, q: '' } });
    if (props.onModelClose) {
      props.onModelClose(e);
    }
  }

  const clearUserId = () => {
    const m = state.model;
    if (m) {
      m.q = '';
      setState({ model: m });
    }
  }

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { model } = state;
    setState({ model: { ...model, ...{ [e.target.name]: e.target.value } as any } });
  }

  const onSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setState({ list: [] });
    search(e);
  }


  return (
    <ReactModal
      isOpen={isOpenModel}
      onRequestClose={onModelClose}
      contentLabel='Modal'
      // portalClassName='modal-portal'
      className='modal-portal-content'
      bodyOpenClassName='modal-portal-open'
      overlayClassName='modal-portal-backdrop'
    >
      <div className='view-container'>
        <header>
          <h2>{resource.users_lookup}</h2>
          <button type='button' id='btnClose' name='btnClose' className='btn-close' onClick={onModelClose} />
        </header>
        <div>
          <form id='usersLookupForm' name='usersLookupForm' noValidate={true} ref={refForm as any}>
            <section className='row search-group'>
              <label className='col s12 m6 search-input'>
                <PageSizeSelect size={component.pageSize} sizes={component.pageSizes} onChange={pageSizeChanged} />
                <input type='text'
                  id='q'
                  name='q'
                  onChange={onChangeText}
                  value={filter.q}
                  maxLength={40}
                  placeholder={resource.user_lookup} />
                <button type='button' hidden={!filter.userId} className='btn-remove-text' onClick={clearUserId} />
                <button type='submit' className='btn-search' onClick={onSearch} />
              </label>
              <Pagination className='col s12 m6' total={component.total} size={component.pageSize} max={component.pageMaxSize} page={component.pageIndex} onChange={pageChanged} />
            </section>
          </form>
          <form className='list-result'>
            <div className='table-responsive'>
              <table>
                <thead>
                  <tr>
                    <th>{resource.sequence}</th>
                    <th data-field='userId'><button type='button' id='sortUserId' onClick={sort}>{resource.user_id}</button></th>
                    <th data-field='username'><button type='button' id='sortUsername' onClick={sort}>{resource.username}</button></th>
                    <th data-field='email'><button type='button' id='sortEmail' onClick={sort}>{resource.email}</button></th>
                    <th data-field='displayname'><button type='button' id='sortDisplayName' onClick={sort}>{resource.display_name}</button></th>
                    <th data-field='status'><button type='button' id='sortStatus' onClick={sort}>{resource.status}</button></th>
                    <th>{resource.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {state && list && list.map((user, i) => {
                    const result = users.find(v => v.userId === user.userId);
                    if (!result) {
                      index++;
                      return (
                        <tr key={i}>
                          <td className='text-right'>{index}</td>
                          <td>{user.userId}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.displayName}</td>
                          <td>{user.status}</td>
                          <td>
                            <input type='checkbox' id={`chkSelect${i}`} value={user.userId} onClick={onCheckUser} />
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>
          </form>
        </div>
        <footer>
          <button type='button' onClick={onModelSave}>{resource.select}</button>
        </footer>
      </div>
    </ReactModal>
  );

}
