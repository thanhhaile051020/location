import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { useEffect, useState } from 'react';
import * as React from 'react';
import PageSizeSelect from 'react-page-size-select';
import { RouteComponentProps } from 'react-router';
import { options, Privilege, storage, StringMap } from 'uione';
import logoTitle from '../assets/images/logo-title.png';
import logo from '../assets/images/logo.png';
import topBannerLogo from '../assets/images/top-banner-logo.png';
import { hideAll, renderItems, showAll } from './menu';
import { useMergeState } from 'react-hook-core'
interface InternalState {
  pageSizes: number[];
  pageSize: number;
  se: any;
  isToggleMenu: boolean;
  isToggleSidebar: boolean;
  isToggleSearch: boolean;
  keyword: string;
  classProfile: string;
  forms: Privilege[];
  username?: string;
  userType?: string;
  pinnedModules: Privilege[];
}
export function sub(n1?: number, n2?: number): number {
  if (!n1 && !n2) {
    return 0;
  } else if (n1 && n2) {
    return n1 - n2;
  } else if (n1) {
    return n1;
  } else if (n2) {
    return -n2;
  }
  return 0;
}
const initialState: InternalState = {
  pageSizes: [10, 20, 40, 60, 100, 200, 400, 10000],
  pageSize: 10,
  se: {} as any,
  keyword: '',
  classProfile: '',
  isToggleMenu: false,
  isToggleSidebar: false,
  isToggleSearch: false,
  forms: [],
  username: '',
  userType: '',
  pinnedModules: []
};
interface Props extends RouteComponentProps {
  children: React.ReactNode;
}
export const DefaultWrapper = ({ ...props }: Props) => {

  const [state, setState] = useMergeState<InternalState>(initialState);
  const [resource] = useState<StringMap>(storage.resource().resource())
  const [httpRequest] = useState<HttpRequest>(new HttpRequest(axios, options))
  const [pageSize] = useState<number>(20)
  const [pageSizes] = useState<number[]>([10, 20, 40, 60, 100, 200, 400, 10000])
  const [topClass, setTopClass] = useState('')
  const [user, setUser] = useState(storage.user())

  useEffect(() => {
    const forms = storage.privileges();
    if (forms && forms.length > 0) {
      for (let i = 0; i <= forms.length; i++) {
        if (forms[i]) {
          forms[i].sequence = i + 1;
        }
      }
    }
    setState({ forms });

    const username = storage.username();
    const storageRole = storage.getUserType();
    if (username || storageRole) {
      setState({ username, userType: storageRole });
    }
  }, [])



  const clearKeyworkOnClick = () => {
    setState({
      keyword: '',
    });
  }

  const searchOnClick = () => { };
  const toggleSearch = () => {
    setState({ isToggleSearch: !state.isToggleSearch });
  }

  const toggleMenu = (e: any) => {
    if (e && e.preventDetault) {
      e.preventDetault();
    }
    setState({ isToggleMenu: !state.isToggleMenu });
  }

  const toggleSidebar = () => {
    setState({ isToggleSidebar: !state.isToggleSidebar });
  }

  function toggleProfile() {
    setState({ classProfile: state.classProfile === 'show' ? '' : 'show' });
  }

  const signout = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const httpRequestSignout = new HttpRequest(axios, options);
    const config: any = storage.config();
    const url = config.authentication_url + '/authentication/signout/' + storage.username();
    httpRequestSignout.get(url).catch(err => { });
    sessionStorage.removeItem('authService');
    sessionStorage.clear();
    storage.setUser(null);
    props.history.push('');
  }

  const viewMyprofile = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    props.history.push('/my-profile');
  }

  const viewMySetting = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    props.history.push('/my-profile/my-settings');
  }

  const viewChangePassword = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    props.history.push('/auth/change-password');
  }

  const pinModulesHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, m: Privilege) => {
    event.stopPropagation();
    const { forms, pinnedModules } = state;
    if (forms.find((module) => module === m)) {
      const removedModule = forms.splice(index, 1);
      pinnedModules.push(removedModule[0]);
      forms.sort((moduleA, moduleB) => sub(moduleA.sequence, moduleB.sequence));
      pinnedModules.sort((moduleA, moduleB) => sub(moduleA.sequence, moduleB.sequence));
      setState({ forms, pinnedModules });
    } else {
      const removedModule = pinnedModules.splice(index, 1);
      forms.push(removedModule[0]);
      forms.sort((moduleA, moduleB) => sub(moduleA.sequence, moduleB.sequence));
      pinnedModules.sort((moduleA, moduleB) => sub(moduleA.sequence, moduleB.sequence));
      setState({ forms, pinnedModules });
    }
  }


  useEffect(() => {
    setUser(storage.user())
    console.log('storage.user()',storage.user())
  }, [storage.user()])
  useEffect(() => {
    const { isToggleSidebar, isToggleMenu, isToggleSearch } = state;
    const topClassList = ['sidebar-parent'];
    if (isToggleSidebar) {
      topClassList.push('sidebar-off');
    }
    if (isToggleMenu) {
      topClassList.push('menu-on');
    }
    if (isToggleSearch) {
      topClassList.push('search');
    }
    setTopClass(topClassList.join(' '));
  }, [state])

  return (
    <div className={topClass}>
      <div className='top-banner'>
        <div className='logo-banner-wrapper'>
          <img src={topBannerLogo} alt='Logo of The Company' />
          <img src={logoTitle} className='banner-logo-title' alt='Logo of The Company' />
        </div>
      </div>
      <div className='menu sidebar'>
        <nav>
          <ul>
            <li>
              <a className='toggle-menu' onClick={toggleMenu} />
              <p className='sidebar-off-menu'>
                <i className='toggle' onClick={toggleSidebar} />
                {!state.isToggleSidebar ? <i className='expand' onClick={showAll} /> : null}
                {!state.isToggleSidebar ? <i className='collapse' onClick={hideAll} /> : null}
              </p>
            </li>
            {renderItems(props.location.pathname, state.pinnedModules, pinModulesHandler, resource, true, true)}
            {renderItems(props.location.pathname, state.forms, pinModulesHandler, resource, true)}
          </ul>
        </nav>
      </div>
      <div className='page-container'>
        <div className='page-header'>
          <form>
            <div className='search-group'>
              <section>
                <button type='button' className='toggle-menu' onClick={toggleMenu} />
                <button type='button' className='toggle-search' onClick={toggleSearch} />
                <button type='button' className='close-search' onClick={toggleSearch} />
              </section>
              <div className='logo-wrapper'>
                <img className='logo' src={logo} alt='Logo of The Company' />
              </div>
              <label className='search-input'>
                <PageSizeSelect size={pageSize} sizes={pageSizes} />
                <input type='text' id='keyword' name='keyword' maxLength={1000} placeholder={resource['keyword']} />
                <button type='button' hidden={!state.keyword} className='btn-remove-text' onClick={clearKeyworkOnClick} />
                <button type='submit' className='btn-search' onClick={searchOnClick} />
              </label>
              <section>
                {/*<button type='button'><i className='fa fa-bell-o'/></button>
                  <button type='button'><i className='fa fa-envelope-o'/></button>*/}
                <div className='dropdown-menu-profile'>
                  {(!user || !user.imageURL) && (
                    <i className='material-icons' onClick={toggleProfile}>
                      person
                    </i>
                  )}
                  <ul id='dropdown-basic' className={state.classProfile + ' dropdown-content-profile'}>
                    {/*
                      <li><a className='dropdown-item-profile'
                             onClick={this.viewMyprofile}>{this.resource.my_profile}</a></li>
                      <li><a className='dropdown-item-profile'
                             onClick={this.viewMySetting}>{this.resource.my_settings}</a></li>
                      <li><a className='dropdown-item-profile'
                             onClick={this.viewChangePassword}>{this.resource.my_password}</a></li>*/}
                    <li>
                      <label>User Name: {state.username} </label>
                      <br />
                      <label>Role : {state.userType === 'M' ? 'Maker' : 'Checker'} </label>
                    </li>
                    <hr style={{ margin: 0 }} />
                    <li>
                      <a className='dropdown-item-profile' onClick={signout}>
                        {resource.button_signout}
                      </a>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </form>
        </div>
        <div className='page-body'>{props.children}</div>
      </div>
    </div>
  );

}
