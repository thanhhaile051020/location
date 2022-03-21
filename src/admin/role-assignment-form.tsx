import { useEffect, useState } from 'react';
import * as React from 'react';
import { buildId, DispatchWithCallback, error, message } from 'react-hook-core';
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import { confirm, handleError, showMessage, storage, useResource } from 'uione';
import femaleIcon from '../assets/images/female.png';
import maleIcon from '../assets/images/male.png';
import { User, useUser } from './service';
import { Role, useRole } from './service';
import { UsersLookup } from './users-lookup';

interface InternalState {
  role: Role;
  users: User[];
  q: string;
  isOpenModel: boolean;
  isCheckboxShown: boolean;
  selectedUsers: User[];
}

const initialState: InternalState = {
  role: {} as any,
  users: [],
  q: '',
  isOpenModel: false,
  isCheckboxShown: false,
  selectedUsers: []
};
const getIds = (users?: User[]): string[] => {
  return users ? users.map(item => item.userId) : [];
};

const initialize = (id: string, set: DispatchWithCallback<Partial<InternalState>>, state: Partial<InternalState>) => {
  const userService = useUser();
  const roleService = useRole();
  Promise.all([
    userService.getUsersByRole(id),
    roleService.load(id),
  ]).then(values => {
    const [users, role] = values;
    if (role) {
      set({ ...state, users, role });
    }
  }).catch(err => error(err, storage.resource().value, storage.alert));
};
export const RoleAssignmentForm = (props: RouteComponentProps) => {
  const [state, setState] = useState(initialState);
  const roleService = useRole();
  const history = useHistory();
  const location = useLocation();
  const resource = useResource();
  const { role, isOpenModel, q } = state;
  let { users, selectedUsers, isCheckboxShown } = state;

  useEffect(() => {
    const id = buildId<string>(props);
    if (id) {
      initialize(id, setState as any, state);
    }
  }, []);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (users) {
      const v = e.target.value;
      const result = users.filter(u => u.username && u.username.includes(v) || u.displayName && u.displayName.includes(v) || u.email && u.email.includes(v));
      const obj = { [e.target.name]: e.target.value, users: result } as any;
      setState({ ...state, ...obj });
    }
  };
  const save = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const userIDs = getIds(users);
    const msg = message(resource, 'msg_confirm_save', 'confirm', 'yes', 'no');
    confirm(msg.message, msg.title, () => {
      roleService.assign(role.roleId, userIDs).then(result => {
        showMessage(resource.msg_save_success);
      }).catch(handleError);
    }, msg.no, msg.yes);
  };

  const onModelSave = (arr: User[]) => {
    arr.map((value) => {
      users.push(value);
    });
    setState({ ...state, role, users, isOpenModel: false });
  };

  const onModelClose = () => {
    setState({ ...state, isOpenModel: false });
  };

  const onCheck = (userId: string) => {
    if (users) {
      const user = users.find(v => v.userId === userId);
      if (user) {
        const index = selectedUsers.indexOf(user);
        if (index !== -1) {
          delete selectedUsers[index];
        } else {
          selectedUsers.push(user);
        }
      }
    }
    setState({ ...state, selectedUsers });
  };

  const onShowCheckBox = () => {
    if (isCheckboxShown === false) {
      isCheckboxShown = true;
    } else {
      isCheckboxShown = false;
    }
    setState({ ...state, isCheckboxShown });
  };

  const onDelete = () => {
    const r = useResource();
    confirm(r.msg_confirm_delete, r.confirm, () => {
      const arr: User[] = [];
      users.map(value => {
        const user = selectedUsers.find(v => v.userId === value.userId);
        if (!user) {
          arr.push(value);
        }
      });
      users = arr;
      selectedUsers = [];
      setState({ ...state, role, users, selectedUsers, isCheckboxShown: false });
    });
  };

  const onCheckAll = () => {
    if (users) {
      selectedUsers = users;
    }
    setState({ ...state, selectedUsers });
  };

  const onUnCheckAll = () => {
    setState({ ...state, selectedUsers: [] });
  };

  const back = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e) {
      e.preventDefault();
    }
    history.goBack();
  };

  return (
    <div className='view-container'>
      <form id='roleAssignmentForm' name='roleAssignmentForm' model-name='role'>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
          <h2>{role.roleName && role.roleName.length > 0 ? role.roleName : resource.role_assignment_subject}</h2>
        </header>
        <div>
          <section className='row'>
            <label className='col s12 m6'>
              {resource.role_id}
              <input type='text'
                id='roleId' name='roleId'
                value={role.roleId}
                maxLength={255}
                placeholder={resource.roleId}
                disabled={true} />
            </label>
            <label className='col s12 m6'>
              {resource.role_name}
              <input type='text'
                id='roleName' name='roleName'
                value={role.roleName}
                maxLength={255}
                placeholder={resource.role_name}
                disabled={true} />
            </label>
          </section>
          <section className='row detail'>
            <h4>
              {resource.user}
              <div className='btn-group'>
                <button type='button'
                  onClick={() => setState({
                    ...state,
                    isOpenModel: true
                  })}>{resource.add}</button>
                <button type='button'
                  onClick={onShowCheckBox}>{isCheckboxShown ? resource.deselect : resource.select}</button>
                {isCheckboxShown ?
                  <button type='button' onClick={onCheckAll}>{resource.check_all}</button> : ''}
                {isCheckboxShown ? <button type='button'
                  onClick={onUnCheckAll}>{resource.uncheck_all}</button> : ''}
                {isCheckboxShown ? <button type='button'
                  onClick={onDelete}>{resource.delete}</button> : ''}
              </div>
            </h4>
            <label className='col s12 search-input'>
              <i className='btn-search' />
              <input type='text'
                id='q'
                name='q'
                onChange={onSearch}
                value={q}
                maxLength={40}
                placeholder={resource.role_assignment_search_user} />
            </label>
            <ul className='row list-view'>
              {users && users?.map((user, i) => {
                const result = selectedUsers.find(v => v.userId === user.userId);
                return (
                  <li key={i} className='col s12 m6 l4 xl3'
                    onClick={isCheckboxShown === true ? () => onCheck(user.userId) : () => {
                    }}>
                    <section>
                      {isCheckboxShown === true ? <input type='checkbox' name='selected'
                        checked={result ? true : false} /> : ''}
                      <img src={user.imageURL && user.imageURL.length > 0 ? user.imageURL : (user.gender === 'F' ? femaleIcon : maleIcon)} className='round-border' />
                      <div>
                        <h3>{user.displayName}</h3>
                        <p>{user.email}</p>
                      </div>
                      <button className='btn-detail' />
                    </section>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
        <footer>
          <button type='submit' id='btnSave' name='btnSave' onClick={save}>{resource.save}</button>
        </footer>
      </form>
      <UsersLookup
        location={location}
        history={history}
        match={props.match}
        props={props['props']}
        isOpenModel={isOpenModel}
        onModelClose={onModelClose}
        onModelSave={onModelSave}
        users={users}
      />
    </div>
  );
};
