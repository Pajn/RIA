import * as React from 'react';
import {render} from 'react-dom';
import {Link, IndexRedirect, Router, Route} from 'react-router';

import {Devices} from './components/devices';

if (window.document) {
  //require('offline-plugin/runtime').install();
}

class App extends React.Component<{children: JSX.Element}, {}> {

  render() {
    return (
      <div>
        <main>{this.props.children}</main>
      </div>
    );
  }
}

export function routes() {
  return (
    <Route path='/' component={App}>
      <IndexRedirect to='/devices' />
      <Route path='devices' component={Devices} />
    </Route>
  );
}

if (window.document) {
  render(<Router>{routes()}</Router>, document.getElementById('app'));
}
