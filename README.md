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
A route is a url path/pattern that represents the screens your application displays to users.
#### Url Params


## Exampe Setup
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
        {path: "/", component: "WelcomeScreen"},
        {path: "/shows", component: "CatalogScreen", root: true},
        {path: "/movies", component: "CatalogScreen", root: true},
        {path: "/details/series/:id", component: "DetailsScreen"},
        {path: "/details/series/:id/cast", component: "CastDetailsScreen"},
        {path: "/details/movies/:id", component: "DetailsScreen"},
        {path: "/details/movies/:id/cast", component: "CastDetailsScreen"},
        {path: "/:screenName", component: "DefaultScreen"}
    ])
end sub
```

## Development

Currently in development
