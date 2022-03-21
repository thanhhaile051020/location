import * as React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { ChangePasswordForm } from './change-password-form';
import { ForgotPasswordForm } from './forgot-password-form';
import { ResetPasswordForm } from './reset-password-form';
import { SigninForm } from './signin-form';
import { SignupForm } from './signup-form';

class Authentication extends React.Component<RouteComponentProps<any>, any> {
  render() {
    const currentUrl = this.props.match.url;
    return (
      <Switch>
        <Route path={currentUrl + '/signup'} exact={true} component={SignupForm} />
        <Route path={currentUrl + '/signin'} exact={true} component={SigninForm} />
        <Route path={currentUrl} exact={true} component={SigninForm} />
        <Route path={currentUrl + '/change-password'} exact={true} component={ChangePasswordForm} />
        <Route path={currentUrl + '/forgot-password'} exact={true} component={ForgotPasswordForm} />
        <Route path={currentUrl + '/reset-password'} exact={true} component={ResetPasswordForm} />
      </Switch>
    );
  }
}
const authenticationRoutes = withRouter(Authentication);
export default authenticationRoutes;
