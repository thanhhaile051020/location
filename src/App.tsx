import { merge } from 'config-plus';
import * as csv from 'csvtojson';
import { currency, locale } from 'locale-service';
import * as moment from 'moment';
import { phonecodes } from 'phonecodes';
import * as React from 'react';
import { Groups } from 'react-groups';
import { Loading } from 'react-hook-core';
import * as LazyLoadModule from 'react-loadable';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { alert, confirm } from 'ui-alert';
import { loading } from 'ui-loading';
import { resources as uiresources, UIService } from 'ui-plus';
import { toast } from 'ui-toast';
import { privileges as usePrivileges, storage, useResource } from 'uione';
import { resources as vresources } from 'validation-core';
import { DefaultCsvService, resources } from 'web-clients';
import authenticationRoutes from './authentication';
import { config, env } from './config';
import NotFoundPage from './core/containers/400/page';
import UnAuthorizedPage from './core/containers/401/page';
import InternalServerErrorPage from './core/containers/500/page';
import {DefaultWrapper} from './core/default';
import { resources as locales } from './core/resources';

const adminRoutes = LazyLoadModule({ loader: () => import(`./admin`), loading: Loading });

const backofficeRoutes = LazyLoadModule({ loader: () => import(`./backoffice`), loading: Loading });

function parseDate(value: string, format: string): Date|null|undefined {
  if (!format || format.length === 0) {
    format = 'MM/DD/YYYY';
  } else {
    format = format.toUpperCase();
  }
  try {
    const d = moment(value, format).toDate();
    return d;
  } catch (err) {
    return null;
  }
}
export function getToken(): string|undefined {
  return undefined;
}
export function init() {
  const conf = merge(config, process.env, env, process.env.ENV);
  storage.setConfig(conf);
  resources.csv = new DefaultCsvService(csv);
  resources.config = {
    list: 'list'
  };
  if (storage.home == null || storage.home === undefined) {
    storage.home = '/welcome';
  }
  // storage.token = getToken;
  storage.moment = true;
  storage.home = '/welcome';
  storage.setResources(locales);
  storage.setLoadingService(loading);
  storage.setUIService(new UIService());
  storage.currency = currency;
  storage.locale = locale;
  storage.alert = alert;
  storage.confirm = confirm;
  storage.message = toast;

  const resource = storage.resource();
  vresources.phonecodes = phonecodes;
  uiresources.date = parseDate;
  uiresources.currency = currency;
  uiresources.resource = resource;
}
class StatelessApp extends React.Component<RouteComponentProps<any>, any> {
  constructor(props: RouteComponentProps<any>) {
    super(props);
    init();
  }
  render() {
    if (location.href.startsWith(storage.redirectUrl) || location.href.startsWith(location.origin + '/index.html?oauth_token=')) {
      window.location.href = location.origin + '/auth/connect/oauth2' + location.search;
    }
    return (
      <Switch>
        <Route path='/401' component={UnAuthorizedPage} />
        <Route path='/500' component={InternalServerErrorPage} />
        <Route path='/auth' component={authenticationRoutes} />
        <Route path='/' exact={true} render={(props) => (<Redirect to='/auth' {...props} />)} />

        <DefaultWrapper history={this.props.history} location={this.props.location} match={this.props.match}>
          <Route path='/welcome' component={Welcome} />
          <Route path='' component={adminRoutes} />
          <Route path='' component={backofficeRoutes} />
        </DefaultWrapper>

        <Route path='**' component={NotFoundPage} />
      </Switch>
    );
  }
}
export function Welcome() {
  const resource = useResource();
  const groups = usePrivileges();
  return <Groups title={resource.welcome_title}
    groups={groups}
    resource={resource}
    className='view-container menu'
    groupClass='row group hr-height-1'
    headerClass='col s12 m12'
    subClass='col s6 m6 l3 xl2 group-span'/>;
}
export const App = withRouter(StatelessApp);
