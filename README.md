<h1 align="center">Roku Router - Modern View Management</h1>
<br>
<p align="center">
	<img src="https://github.com/user-attachments/assets/734ca644-8d42-49be-84b3-2a717e6f3267" alt="angular-logo" width="120px" height="149px"/>
	<br>
	<em>Roku Router is a solution for managing navigation between views in Roku<br> application by mapping URL paths to components. It provides features like route guards<br> and parameter handling to create dynamic applications with smooth user experiences.</em>
</p>
<br>

[![build status](https://img.shields.io/github/workflow/status/TKSS-Software/roku-router/build.yml?logo=github&branch=master)](https://github.com/TKSS-Software/roku-router/actions?query=branch%3Amaster+workflow%3Abuild)
[![monthly downloads](https://img.shields.io/npm/dm/@tkss/roku-router.svg?sanitize=true&logo=npm&logoColor=)](https://npmcharts.com/compare/@tkss/roku-router?minimal=true)
[![npm version](https://img.shields.io/npm/v/@tkss/roku-router.svg?logo=npm)](https://www.npmjs.com/package/@tkss/roku-router)
[![license](https://img.shields.io/github/license/TKSS-Software/roku-router.svg)](LICENSE)
[![Slack](https://img.shields.io/badge/Slack-RokuCommunity-4A154B?logo=slack)](https://join.slack.com/t/rokudevelopers/shared_invite/zt-4vw7rg6v-NH46oY7hTktpRIBM_zGvwA)


<hr>

## Installation
### Using [ropm](https://www.npmjs.com/package/roku-router)
```bash
ropm install roku-router@npm:@tkss/roku-router
```

## Concepts
#### Route
A route is a configuration object used by the Roku Router to define navigation paths within the application. Routes allow you to map URL style paths to View components, enabling users to navigate between different Views.

#### View
Views are components that get rendered based on the active route. They contain the following lifecycle functions. 
- `beforeViewOpen` - Called before the view loads.  This is where you would perform business logic like API calls and building your UI if you want to delay opening the View until ready.
- `onViewOpen` - Called after previous view is closed or suspended. This is where you would perform business logic like API calls and building your UI if you want to open your View immediatley and handle the loading UI state manually.
- `beforeScreenClose` - Called before a screen is destroyed. This does not get called when a new View is added to the stack (see onSuspend).
- `onRouteUpdate` - Called when a new route is requested that matches the same URL pattern and the Route is configured for `allowReuse` or the same url has been requested with a new hash value.
- `onSuspend` - Called when a View is suspended. The most common case for this is when a new View is added to the stack.  
- `onResume` - Called when a suspended View is resumed. The most common case for this is when a View above the stack is closed and the suspended View is to take over.
- `handleFocus` - Called when the View should determine what to do with focus.  This is called immediatley after the active View is opened on resumed.

#### Url Mapping
Each route maps a URL path (or pattern) to a specific component. For example, navigating to /home could display a HomeComponent.
<br/><br/>
## Route Configuration
Routes are typically configured in a routing module using an array of route objects. Each route object can specify:
- `pattern` (required): The URL style pattern that represents the route.
- `component` (required): The component to render when the route is activated. This component must extend the **RouterView** component.
- `isRoot` (optional): Views that are defined as root are considered at the top of the view stack. When navigating to a root screen, the stack is cleared and the breadcrumbs are reset.  These could be hub screens such as a Shows or Movie hubs that are top level in your menu.
- `canActivate` (optional): A route guard that controls access to the route. An example of this would be to validate the user has authenticated before navigating to a screen (particularly useful when using deeplinks).
- `isDialog` (optional): Defining isDialog will notify the router to fire the dialog beacons. DO WE NEED?

<br/><br/>
## Example Setup
#### Scenegraph XML
```XML
<component name="MainScene" extends="Scene">
	<children>
		<rokurouter_router id="router" />
	</children>
</component>

```
#### Brighterscript
```brighterscript
sub init()
    m.router = m.top.findNode("router")
    m.router@.addRoutes([
        {pattern: "/", component: "WelcomeScreen"},
        {pattern: "/shows", component: "CatalogScreen", root: true},
        {pattern: "/movies", component: "CatalogScreen", root: true},
        {pattern: "/details/series/:id", component: "DetailsScreen"},
        {pattern: "/details/series/:id/cast", component: "CastDetailsScreen"},
        {pattern: "/details/movies/:id", component: "DetailsScreen"},
        {pattern: "/details/movies/:id/cast", component: "CastDetailsScreen"},
        {pattern: "/:screenName", component: "DefaultScreen"}
    ])
end sub
```

## Development

Currently in development
