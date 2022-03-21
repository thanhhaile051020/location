import * as React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { MessageComponent, MessageState, navigate } from 'react-hook-core';
import { RouteComponentProps } from 'react-router';
import { isEmail, isValidUsername, SignupService, Status, strongPassword, User, validate, validateAndSignup } from 'signup-client';
import { handleError, initForm, registerEvents, storage } from 'uione';
import logo from '../assets/images/logo.png';
import { context } from './service';

const status: Status = {
  error: 0,
  success: 1,
  username: 2,
  contact: 3,
  format_username: -2,
  format_contact: -3,
  format_password: -1
};
interface SignupState extends MessageState {
  user: User;
  confirmPassword: string;
  reCAPTCHA: string | null;
  passwordRequired: boolean;
}
export class SignupForm extends MessageComponent<SignupState, RouteComponentProps> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.signin = this.signin.bind(this);
    this.signup = this.signup.bind(this);
    this.signupService = context.getSignupService();
    const user: User = {
      username: '',
      contact: '',
      password: '',
    };
    this.state = {
      message: '',
      user,
      confirmPassword: '',
      reCAPTCHA: '',
      passwordRequired: true
    };
  }
  private signupService: SignupService<User>;

  componentDidMount() {
    this.form = initForm(this.ref.current, registerEvents);
  }

  checkPass = () => {
    this.setState({
      passwordRequired: !this.state.passwordRequired
    });
  }

  signin() {
    navigate(this.props.history, 'connect/signin');
  }

  signup(event: any) {
    event.preventDefault();
    const r = storage.resource();
    const { reCAPTCHA } = this.state;
    if (!reCAPTCHA) {
      this.showError(r.value('error_captcha'));
      return;
    }
    const { user, passwordRequired, confirmPassword } = this.state;
    validateAndSignup(this.signupService.signup, status, user, passwordRequired, confirmPassword, r,
      this.showMessage, this.showError, this.hideMessage,
      isValidUsername, isEmail, validate, handleError, strongPassword, storage.loading());
  }

  onChange = (value: string | null) => {
    this.setState({ reCAPTCHA: value });
  }
  render() {
    const resource = storage.getResource();
    const { message, user } = this.state;
    return (
      <div className='view-container central-full'>
        <form id='userForm' name='userForm' noValidate={true} autoComplete='off' ref={this.ref}>
          <div>
            <img className='logo' src={logo} />
            <h2>{resource.signup}</h2>
            <div className={'message ' + this.alertClass}>
              {message}
              <span onClick={this.hideMessage} hidden={!message || message === ''} />
            </div>
            <label>
              {resource.username}
              <input type='text'
                id='username' name='username'
                value={user.username}
                placeholder={resource.placeholder_username}
                onChange={this.updateState}
                maxLength={255} required={true} />
            </label>
            <label>
              {resource.email}
              <input type='text'
                id='contact' name='contact'
                value={user.contact}
                placeholder={resource.placeholder_email}
                onChange={this.updateState}
                maxLength={255} required={true} />
            </label>
            {/*<label>
              use password:
              <input id = 'usePass' name='usePass'
                  type='checkbox'
                  checked={this.state.passwordRequired}
                  onChange={() => this.checkPass()} />
            </label>*/}
            <label hidden={!this.state.passwordRequired}>
              {resource.password}
              <input type='password'
                id='password' name='password'
                value={user.password}
                placeholder={resource.placeholder_password}
                onChange={this.updateState}
                maxLength={255} />
            </label>
            <label hidden={!this.state.passwordRequired}>
              {resource.confirm_password}
              <input type='password'
                id='confirmPassword' name='confirmPassword'
                placeholder={resource.placeholder_confirm_password}
                onChange={this.updateFlatState}
                maxLength={255} />
            </label>
            <div style={{ marginTop: '10px' }}>
              <ReCAPTCHA
                sitekey='6LetDbQUAAAAAEqIqVnSKgrI644y8w7O8mk89ijV'
                onChange={this.onChange}
              />
            </div>
            <button type='submit' id='btnSignup' name='btnSignup' onClick={this.signup}>
              {resource.button_signup}
            </button>
            <a id='btnSignin' onClick={this.signin}>{resource.button_signin}</a>
          </div>
        </form>
      </div>
    );
  }
}
