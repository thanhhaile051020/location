import axios from 'axios';
import { HttpRequest } from 'axios-core';
import * as React from 'react';
import PageSizeSelect from 'react-page-size-select';
import { RouteComponentProps } from 'react-router';
import { options, Privilege, storage, StringMap } from 'uione';
import logoTitle from '../assets/images/logo-title.png';
import logo from '../assets/images/logo.png';
import topBannerLogo from '../assets/images/top-banner-logo.png';
import { hideAll, renderItems, showAll } from './menu';

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
export default class DefaultWrapper extends React.Component<RouteComponentProps, InternalState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.resource = storage.resource().resource();
    this.pinModulesHandler = this.pinModulesHandler.bind(this);
    // this.menuItemOnBlur = this.menuItemOnBlur.bind(this);
    this.state = {
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
      pinnedModules: [],
    };
    this.httpRequest = new HttpRequest(axios, options);
  }
  protected resource: StringMap;
  protected httpRequest: HttpRequest;
  protected pageSize = 20;
  protected pageSizes = [10, 20, 40, 60, 100, 200, 400, 10000];
  componentDidMount() {
    // TODO : TB temporary fix form service null .
    /*
    if (!this.formService) {
      this.formService = new FormServiceImpl();
    }
    this.formService.getMyForm().subscribe(forms => {
      if (forms) {
        this.setState({ forms });
      } else {
        logger.warn('DefaultWrapper:  cannot load form from cache , re direct');
        this.props.history.push('/');
      }
    });
    */
    const forms = storage.privileges();
    if (forms && forms.length > 0) {
      for (let i = 0; i <= forms.length; i++) {
        if (forms[i]) {
          forms[i].sequence = i + 1;
        }
      }
    }
    this.setState({ forms });

    const username = storage.username();
    const storageRole = storage.getUserType();
    if (username || storageRole) {
      this.setState({ username, userType: storageRole });
    }
  }

  clearKeyworkOnClick = () => {
    this.setState({
      keyword: '',
    });
  }

  searchOnClick = () => { };
  toggleSearch = () => {
    this.setState((prev) => ({ isToggleSearch: !prev.isToggleSearch }));
  }

  toggleMenu = (e: any) => {
    if (e && e.preventDetault) {
      e.preventDetault();
    }
    this.setState((prev) => ({ isToggleMenu: !prev.isToggleMenu }));
  }

  toggleSidebar = () => {
    this.setState((prev) => ({ isToggleSidebar: !prev.isToggleSidebar }));
  }

  toggleProfile = () => {
    this.setState((prevState) => {
      return { classProfile: prevState.classProfile === 'show' ? '' : 'show' };
    });
  }

  signout = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const httpRequest = new HttpRequest(axios, options);
    const config: any = storage.config();
    const url = config.authentication_url + '/authentication/signout/' + storage.username();
    httpRequest.get(url).catch(err => { });
    sessionStorage.removeItem('authService');
    sessionStorage.clear();
    storage.setUser(null);
    this.props.history.push('');
  }

  viewMyprofile = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    this.props.history.push('/my-profile');
  }

  viewMySetting = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    this.props.history.push('/my-profile/my-settings');
  }

  viewChangePassword = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    this.props.history.push('/auth/change-password');
  }

  pinModulesHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, m: Privilege) {
    event.stopPropagation();
    const { forms, pinnedModules } = this.state;
    if (forms.find((module) => module === m)) {
      const removedModule = forms.splice(index, 1);
      pinnedModules.push(removedModule[0]);
      forms.sort((moduleA, moduleB) => sub(moduleA.sequence, moduleB.sequence));
      pinnedModules.sort((moduleA, moduleB) => sub(moduleA.sequence, moduleB.sequence));
      this.setState({ forms, pinnedModules });
    } else {
      const removedModule = pinnedModules.splice(index, 1);
      forms.push(removedModule[0]);
      forms.sort((moduleA, moduleB) => sub(moduleA.sequence, moduleB.sequence));
      pinnedModules.sort((moduleA, moduleB) => sub(moduleA.sequence, moduleB.sequence));
      this.setState({ forms, pinnedModules });
    }
  }

  render() {
    const pageSize = this.pageSize;
    const pageSizes = this.pageSizes;
    const { children } = this.props;
    const { isToggleSidebar, isToggleMenu, isToggleSearch, userType, username } = this.state;
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
    const topClass = topClassList.join(' ');
    const user = storage.user();
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
                <a className='toggle-menu' onClick={this.toggleMenu} />
                <p className='sidebar-off-menu'>
                  <i className='toggle' onClick={this.toggleSidebar} />
                  {!isToggleSidebar ? <i className='expand' onClick={showAll} /> : null}
                  {!isToggleSidebar ? <i className='collapse' onClick={hideAll} /> : null}
                </p>
              </li>
              {renderItems(this.props.location.pathname, this.state.pinnedModules, this.pinModulesHandler, this.resource, true, true)}
              {renderItems(this.props.location.pathname, this.state.forms, this.pinModulesHandler, this.resource, true)}
            </ul>
          </nav>
        </div>
        <div className='page-container'>
          <div className='page-header'>
            <form>
              <div className='search-group'>
                <section>
                  <button type='button' className='toggle-menu' onClick={this.toggleMenu} />
                  <button type='button' className='toggle-search' onClick={this.toggleSearch} />
                  <button type='button' className='close-search' onClick={this.toggleSearch} />
                </section>
                <div className='logo-wrapper'>
                  <img className='logo' src={logo} alt='Logo of The Company' />
                </div>
                <label className='search-input'>
                  <PageSizeSelect size={pageSize} sizes={pageSizes} />
                  <input type='text' id='keyword' name='keyword' maxLength={1000} placeholder={this.resource['keyword']} />
                  <button type='button' hidden={!this.state.keyword} className='btn-remove-text' onClick={this.clearKeyworkOnClick} />
                  <button type='submit' className='btn-search' onClick={this.searchOnClick} />
                </label>
                <section>
                  {/*<button type='button'><i className='fa fa-bell-o'/></button>
                  <button type='button'><i className='fa fa-envelope-o'/></button>*/}
                  <div className='dropdown-menu-profile'>
                    {(!user || !user.imageURL) && (
                      <i className='material-icons' onClick={this.toggleProfile}>
                        person
                      </i>
                    )}
                    <ul id='dropdown-basic' className={this.state.classProfile + ' dropdown-content-profile'}>
                      {/*
                      <li><a className='dropdown-item-profile'
                             onClick={this.viewMyprofile}>{this.resource.my_profile}</a></li>
                      <li><a className='dropdown-item-profile'
                             onClick={this.viewMySetting}>{this.resource.my_settings}</a></li>
                      <li><a className='dropdown-item-profile'
                             onClick={this.viewChangePassword}>{this.resource.my_password}</a></li>*/}
                      <li>
                        <label>User Name: {username} </label>
                        <br />
                        <label>Role : {userType === 'M' ? 'Maker' : 'Checker'} </label>
                      </li>
                      <hr style={{ margin: 0 }} />
                      <li>
                        <a className='dropdown-item-profile' onClick={this.signout}>
                          {this.resource.button_signout}
                        </a>
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            </form>
          </div>
          <div className='page-body'>{children}</div>
        </div>
      </div>
    );
  }
}
