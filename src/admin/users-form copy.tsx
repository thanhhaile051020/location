import * as React from 'react';
import { SearchComponent, SearchState, value } from 'react-hook-core';
import * as ReactModal from 'react-modal';
import PageSizeSelect from 'react-page-size-select';
import { RouteComponentProps } from 'react-router';
import Pagination from 'reactx-pagination';
import { initForm, inputSearch, registerEvents, storage } from 'uione';
import { User, UserFilter, useUser } from './service';

interface InternalState extends SearchState<User, UserFilter> {
  users: User[];
  availableUsers: User[];
}
interface Props extends RouteComponentProps {
  isOpenModel: boolean;
  users: User[];
  onModelClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onModelSave: (e: User[]) => void;
  props?: any;
}

export class UsersLookup extends SearchComponent<User, UserFilter, Props, InternalState> {
  constructor(props: Props) {
    super(props, useUser(), inputSearch());
    this.createFilter = this.createFilter.bind(this);
    this.state = {
      list: [],
      users: [],
      availableUsers: [],
      model: {
        q: '',
        userId: '',
        username: '',
        displayName: '',
        email: '',
        status: []
      }
    };
  }
  componentDidMount() {
    this.form = initForm(this.ref.current, registerEvents);
    this.load(this.createFilter(), storage.autoSearch);
  }
  createFilter(): UserFilter {
    const obj: any = {};
    return obj;
  }
  onCheckUser = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const { users, list } = this.state;
    const target: HTMLInputElement = e.target as HTMLInputElement;
    const result = (list ? list.find(v => v.userId === target.value) : undefined);
    if (result) {
      const index = users.indexOf(result);
      if (index !== -1) {
        delete users[index];
      } else {
        users.push(result);
      }
      this.setState({ users });
    }
  }

  onModelSave = () => {
    this.setState({ users: [], availableUsers: [], q: '' });
    this.props.onModelSave(this.state.users);
  }

  onModelClose = (e: React.MouseEvent | React.KeyboardEvent) => {
    this.setState({ users: [], availableUsers: [], q: '' });
    if (this.props.onModelClose) {
      this.props.onModelClose(e);
    }
  }

  protected clearUserId = () => {
    const m = this.state.model;
    if (m) {
      m.q = '';
      this.setState({ model: m });
    }
  }

  onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { model } = this.state;
    this.setState({ model: { ...model, ...{ [e.target.name]: e.target.value } as any } });
  }

  onSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setState({ list: [] });
    this.search(e);
  }

  render() {
    const { isOpenModel } = this.props;
    const users = this.props.users ? this.props.users : [];
    const { list } = this.state;
    const filter = value(this.state.model);
    const resource = this.resource;
    let index = 0;
    return (
      <ReactModal
        isOpen={isOpenModel}
        onRequestClose={this.props.onModelClose}
        contentLabel='Modal'
        // portalClassName='modal-portal'
        className='modal-portal-content'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'
      >
        <div className='view-container'>
          <header>
            <h2>{resource.users_lookup}</h2>
            <button type='button' id='btnClose' name='btnClose' className='btn-close' onClick={this.onModelClose} />
          </header>
          <div>
            <form id='usersLookupForm' name='usersLookupForm' noValidate={true} ref={this.ref}>
              <section className='row search-group'>
                <label className='col s12 m6 search-input'>
                  <PageSizeSelect size={this.pageSize} sizes={this.pageSizes} onChange={this.pageSizeChanged} />
                  <input type='text'
                    id='q'
                    name='q'
                    onChange={this.onChangeText}
                    value={filter.q}
                    maxLength={40}
                    placeholder={resource.user_lookup} />
                  <button type='button' hidden={!filter.userId} className='btn-remove-text' onClick={this.clearUserId} />
                  <button type='submit' className='btn-search' onClick={this.onSearch} />
                </label>
                <Pagination className='col s12 m6' total={this.total} size={this.pageSize} max={this.pageMaxSize} page={this.pageIndex} onChange={this.pageChanged} />
              </section>
            </form>
            <form className='list-result'>
              <div className='table-responsive'>
                <table>
                  <thead>
                    <tr>
                      <th>{resource.sequence}</th>
                      <th data-field='userId'><button type='button' id='sortUserId' onClick={this.sort}>{resource.user_id}</button></th>
                      <th data-field='username'><button type='button' id='sortUsername' onClick={this.sort}>{resource.username}</button></th>
                      <th data-field='email'><button type='button' id='sortEmail' onClick={this.sort}>{resource.email}</button></th>
                      <th data-field='displayname'><button type='button' id='sortDisplayName' onClick={this.sort}>{resource.display_name}</button></th>
                      <th data-field='status'><button type='button' id='sortStatus' onClick={this.sort}>{resource.status}</button></th>
                      <th>{resource.action}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state && list && list.map((user, i) => {
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
                              <input type='checkbox' id={`chkSelect${i}`} value={user.userId} onClick={this.onCheckUser} />
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
            <button type='button' onClick={this.onModelSave}>{resource.select}</button>
          </footer>
        </div>
      </ReactModal>
    );
  }
}
