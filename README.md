# Roku Router
Simple Router and Stack Management system for Roku


[![build status](https://img.shields.io/github/workflow/status/TKSS-Software/roku-router/build.yml?logo=github&branch=master)](https://github.com/TKSS-Software/roku-router/actions?query=branch%3Amaster+workflow%3Abuild)
[![monthly downloads](https://img.shields.io/npm/dm/@tkss/roku-router.svg?sanitize=true&logo=npm&logoColor=)](https://npmcharts.com/compare/@tkss/roku-router?minimal=true)
[![npm version](https://img.shields.io/npm/v/@tkss/roku-router.svg?logo=npm)](https://www.npmjs.com/package/@tkss/roku-router)
[![license](https://img.shields.io/github/license/TKSS-Software/roku-router.svg)](LICENSE)
[![Slack](https://img.shields.io/badge/Slack-RokuCommunity-4A154B?logo=slack)](https://join.slack.com/t/rokudevelopers/shared_invite/zt-4vw7rg6v-NH46oY7hTktpRIBM_zGvwA)




## Installation
### Using [ropm](https://www.npmjs.com/package/roku-router)
```bash
ropm install roku-router@npm:@tkss/roku-router
```

## Concepts
#### Route
A route is a configuration object used by the Roku Router to define navigation paths within the application. Routes allow you to map URL style paths to components, enabling users to navigate between different views.

#### Url Mapping
Each route maps a URL path (or pattern) to a specific component. For example, navigating to /home could display a HomeComponent.
<br/><br/>
## Route Configuration
Routes are typically configured in a routing module using an array of route objects. Each route object can specify:
- `pattern` (required): The URL style pattern that represents the route.
- `component` (required): The component to render when the route is activated. This component must extend the **RouterView** component.
- `TODO isRoot` (optional): Views that are defined as root are considered at the top of the view stack. When navigating to a root screen, the stack is cleared and the breadcrumbs are reset.  These could be hub screens such as a Shows or Movie hubs that are top level in your menu.
- `canActivate` (optional): A route guard that controls access to the route. An example of this would be to validate the user has authenticated before navigating to a screen (particularly useful when using deeplinks).
- `isDialog` (optional): Defining isDialog will notify the router to fire the dialog beacons. DO WE NEED?

<br/><br/>
## Example Setup
#### Scenegraph XML
```XML
<component name="MainScene" extends="Scene">
	<children>
		<Router id="router" />
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
