import { dayDiff, getMessage, handleCookie, initFromCookie, Result, Status, store, User, validate } from 'authen-client';
import { CookieService } from 'cookie-core';
import { Base64 } from 'js-base64';
import * as React from 'react';
import { initForm, useMessage, useUpdate } from 'react-hook-core';
import { useHistory } from 'react-router-dom';
import { alertInfo } from 'ui-alert';
import { getResource, handleError, loading, message, registerEvents, setPrivileges, setUser, storage, useResource } from 'uione';
import logo from '../assets/images/logo.png';
import { useAuthen } from './service';

export const map = {
  '3': 'fail_authentication',
  '4': 'fail_wrong_password',
  '5': 'fail_expired_password',
  '6': 'fail_access_time_locked',
  '7': 'fail_suspended_account',
  '8': 'fail_locked_account',
  '9': 'fail_disabled_account',
  '10': 'fail_disabled_account',
};

const status: Status = {
  success: 1,
  two_factor_required: 2,
  fail: 3,
  password_expired: 5
};
interface SigninState {
  user: User;
  remember: boolean;
}

const msgData = {
  message: '',
  alertClass: '',
};
const signinData: SigninState = {
  user: {
    username: '',
    password: '',
    passcode: ''
  },
  remember: false,
};
const cookie = new CookieService(document);
function init(getCookie: (name: string) => string): SigninState {
  const user = {
    username: '',
    passcode: '',
    password: ''
  };
  const remember = initFromCookie('data', user, getCookie, Base64.decode);
  return { user, remember };
}

export const SigninForm = () => {
  const history = useHistory();
  const resource = useResource();
  const { msg, showError, hideMessage} = useMessage(msgData);
  const { state, setState, updateState } = useUpdate<SigninState>(signinData, 'user');
  const form = React.useRef();
  React.useEffect(() => {
    if (form) {
      initForm(form.current, registerEvents);
    }
    const usr = init(cookie.get);
    setState(usr);
  }, []);
  const updateRemember = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    state.remember = !state.remember;
    setState(state);
  };

  const isTwoFactor = (state.user.step ? state.user.step === 1 : false);
  const forgotPassword = () => {
    history.push('/auth/forgot-password');
  };
  const signup = () => {
    history.push('/auth/signup');
  };
  const succeed = (res: Result) => {
    store(res.user, setUser, setPrivileges);
    navigateToHome();
  };
  const navigateToHome = () => {
    const redirect = window.location.search;
    if (redirect) {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);
      history.push(searchParams.get('redirect'));
    } else {
      history.push(storage.home);
    }
  };
  const signin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const r = getResource();
    const user = state.user;
    if (!validate(user, r, showError)) {
      return;
    } else {
      hideMessage();
    }
    const remember = state.remember;
    try {
      loading().showLoading();
      const authenticator = useAuthen();
      const result = await authenticator.authenticate(user);
      const s = result.status;
      if (s === status.two_factor_required) {
        user.step = 1;
        state.user = user;
        setState(state);
      } else if (s === status.success || s === status.success_and_reactivated) {
        handleCookie('data', user, remember, cookie, 60 * 24 * 3, Base64.encode);
        if (result.user) {
          const expiredDays = dayDiff(result.user.passwordExpiredTime, new Date());
          if (expiredDays && expiredDays > 0) {
            const ms = r.format(resource.msg_password_expired_soon, expiredDays);
            message(ms);
          }
        }
        if (s === status.success) {
          succeed(result);
        } else {
          alertInfo(resource.msg_account_reactivated, resource.info, () => {
            succeed(result);
          });
        }
      } else {
        store(undefined, setUser, setPrivileges);
        const ms = getMessage(s, resource, map);
        showError(ms);
      }
    } catch (err) {
      handleError(err);
    } finally {
      loading().hideLoading();
    }
  };

  return (
    <div className='view-container central-full sign-in-view-container'>
      <form id='signinForm' name='signinForm' noValidate={true} autoComplete='off' ref={form as any}>
        <div>
          <img className='logo' src={logo} />
          <h2>{resource.signin}</h2>
          <div className={'message ' + msg.alertClass}>
            {msg.message}
            <span onClick={hideMessage} hidden={!msg.message || msg.message === ''} />
          </div>
          <label hidden={isTwoFactor}>
            {resource.username}
            <input type='text'
              id='username' name='username'
              value={state.user.username}
              onChange={updateState}
              maxLength={100}
              placeholder={resource.placeholder_username}/>
          </label>
          <label hidden={isTwoFactor}>
            {resource.password}
            <input type='password'
              id='password' name='password'
              value={state.user.password}
              onChange={updateState}
              maxLength={100}
              placeholder={resource.placeholder_password}/>
          </label>
          <label hidden={!isTwoFactor}>
            {resource.passcode}
            <input
              type='password'
              id='passcode' name='passcode'
              value={state.user.passcode}
              onChange={updateState}
              maxLength={10}
              placeholder={resource.placeholder_passcode}/>
          </label>
          <label className='col s12 checkbox-container' hidden={isTwoFactor}>
            <input type='checkbox'
              id='remember' name='remember'
              checked={state.remember ? true : false}
              onChange={updateRemember} />
            {resource.signin_remember_me}
          </label>
          <button type='submit' id='btnSignin' name='btnSignin' onClick={signin}>{resource.button_signin}</button>
          <a id='btnForgotPassword' onClick={forgotPassword}>{resource.button_forgot_password}</a>
          <a id='btnSignup' onClick={signup}>{resource.button_signup}</a>
        </div>
      </form>
    </div>
  );
};
