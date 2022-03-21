import { PasswordChange, PasswordService, strongPassword, validateAndChangePassword, validateChange } from 'password-client';
import * as React from 'react';
import { MessageComponent, MessageState, navigate } from 'react-hook-core';
import { RouteComponentProps } from 'react-router';
import { handleError, initForm, loading, registerEvents, storage } from 'uione';
import logo from '../assets/images/logo.png';
import { context } from './service';

export interface ChangePasswordState extends MessageState {
  user: PasswordChange;
  confirmPassword: string;
  hiddenPasscode: boolean;
}
export class ChangePasswordForm extends MessageComponent<ChangePasswordState, RouteComponentProps> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.signin = this.signin.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.passwordService = context.getPasswordServicer();
    const user: PasswordChange = {
      username: '',
      currentPassword: '',
      password: '',
      passcode: '',
    };
    this.state = {
      message: '',
      user,
      confirmPassword: '',
      hiddenPasscode: true
    };
  }
  private passwordService: PasswordService;

  componentDidMount() {
    this.form = initForm(this.ref.current, registerEvents);
  }

  signin() {
    navigate(this.props.history, 'signin');
  }

  changePassword(event: any) {
    event.preventDefault();
    const user = this.state.user;
    validateAndChangePassword(
      this.passwordService.changePassword, user, this.state.confirmPassword,
      storage.resource(), this.showMessage, this.showError, this.hideMessage,
      validateChange, handleError, strongPassword, loading());
    this.setState({ user });
  }
  render() {
    const resource = storage.getResource();
    const { user } = this.state;
    const hiddenPasscode = !(user.step && user.step >= 1);
    return (
      <div className='view-container central-full'>
        <form id='userForm' name='userForm' noValidate={true} autoComplete='off' ref={this.ref}>
          <div>
            <img className='logo' src={logo} />
            <h2>{resource.change_password}</h2>
            <div className={'message ' + this.alertClass}>
              {this.state.message}
              <span onClick={this.hideMessage} hidden={!this.state.message || this.state.message === ''} />
            </div>
            <label hidden={!hiddenPasscode}>
              {resource.username}
              <input type='text'
                id='username' name='username'
                value={user.username}
                onChange={this.updateState}
                maxLength={255}
                placeholder={resource.placeholder_username} />
            </label>
            <label hidden={!hiddenPasscode}>
              {resource.current_password}
              <input type='password' className='form-control'
                id='currentPassword' name='currentPassword'
                value={user.currentPassword}
                onChange={this.updateState}
                maxLength={255}
                placeholder={resource.placeholder_current_password} />
            </label>
            <label hidden={!hiddenPasscode}>
              {resource.new_password}
              <input type='password' className='form-control'
                id='password' name='password'
                value={user.password}
                onChange={this.updateState}
                maxLength={255}
                placeholder={resource.placeholder_new_password} />
            </label>
            <label hidden={!hiddenPasscode}>
              {resource.confirm_password}
              <input type='password' className='form-control'
                id='confirmPassword' name='confirmPassword'
                value={this.state.confirmPassword}
                onChange={this.updateFlatState}
                maxLength={255}
                placeholder={resource.placeholder_confirm_password} />
            </label>
            <label hidden={hiddenPasscode}>
              {resource.passcode}
              <input type='password' className='form-control'
                id='passcode' name='passcode'
                value={user.passcode}
                onChange={this.updateState}
                maxLength={255}
                placeholder={resource.placeholder_passcode} />
            </label>
            <button type='submit' id='btnChangePassword' name='btnChangePassword'
              onClick={this.changePassword}>{resource.button_change_password}</button>
            <a id='btnSignin' onClick={this.signin}>{resource.button_signin}</a>
          </div>
        </form>
      </div>
    );
  }
}
