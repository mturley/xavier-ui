import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import './App.scss';
import '@patternfly/patternfly/patternfly-addons.css';
import { RouterGlobalProps } from './models/router';

declare var insights: any;

interface Props extends RouterGlobalProps { };
interface State { }

class App extends Component<Props, State> {
    appNav: any;
    buildNav: any;

    componentDidMount() {
        insights.chrome.init();
        // TODO change this to your appname
        // TODO should the sample app webpack just rewrite this automatically?
        insights.chrome.identifyApp('dashboard');
        insights.chrome.navigation(buildNavigation());

        this.appNav = insights.chrome.on('APP_NAVIGATION', (event: any) => this.props.history.push(`/${event.navId}`));
        this.buildNav = this.props.history.listen(() => insights.chrome.navigation(buildNavigation()));
    }

    componentWillUnmount() {
        this.appNav();
        this.buildNav();
    }

    render() {
        return (
            <Routes childProps={ this.props } />
        );
    }
}

/**
 * withRouter: https://reacttraining.com/react-router/web/api/withRouter
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default withRouter(connect()(App));

function buildNavigation() {
    const currentPath = window.location.pathname.split('/').slice(-1)[0];
    return [{
        title: 'Actions',
        id: 'actions'
    }, {
        title: 'Rules',
        id: 'rules'
    }].map(item => ({
        ...item,
        active: item.id === currentPath
    }));
}
