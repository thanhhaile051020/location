import * as React from 'react';
import { withDefaultProps } from 'react-hook-core';
import { Redirect, Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { alert, authenticated, useResource } from 'uione';
import { AuditLogsForm } from './audit-logs-form';
import { RoleAssignmentForm } from './role-assignment-form';
import { RoleForm } from './role-form';
import { RolesForm } from './roles-form';
import { UserForm } from './user-form';
import { UsersForm } from './users-form';

class Admin extends React.Component<RouteComponentProps<any>, any> {
  render() {
    if (authenticated()) {
      return (
        <React.Fragment>
          <Route path={this.props.match.url + 'users'} exact={true} component={withDefaultProps(UsersForm)} />
          <Route path={this.props.match.url + 'users/add'} exact={true} component={withDefaultProps(UserForm)} />
          <Route path={this.props.match.url + 'users/edit/:id'} exact={true} component={withDefaultProps(UserForm)} />

          <Route path={this.props.match.url + 'roles'} exact={true} component={withDefaultProps(RolesForm)} />
          <Route path={this.props.match.url + 'roles/add'} exact={true} component={withDefaultProps(RoleForm)} />
          <Route path={this.props.match.url + 'roles/edit/:id'} exact={true} component={withDefaultProps(RoleForm)} />
          <Route path={this.props.match.url + 'roles/assign/:id'} exact={true} component={withDefaultProps(RoleAssignmentForm)} />

          <Route path={this.props.match.url + 'audit-logs'} exact={true} component={withDefaultProps(AuditLogsForm)} />
        </React.Fragment>
      );
    } else {
      const resource = useResource();
      const title = resource.error_permission;
      const msg = resource.error_unauthorized;
      alert(msg, title);
      return <Redirect to={{ pathname: '/auth', state: { from: this.props.location } }} />;
    }
  }
}

const adminRoutes = withRouter(Admin);
export default adminRoutes;
