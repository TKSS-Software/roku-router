# Roku Router – Modern View Management for Roku Applications

<p align="center">
  <img src="https://github.com/user-attachments/assets/734ca644-8d42-49be-84b3-2a717e6f3267" alt="roku-router-logo" width="120px" height="149px"/>
</p>

<p align="center">
  <em>A lightweight, modern router for Roku SceneGraph apps. Roku Router maps URL-style paths to components, manages view lifecycles, handles parameters, and supports route guards — enabling dynamic and seamless navigation experiences.</em>
</p>

<p align="center">
  <a href="https://github.com/TKSS-Software/roku-router/actions?query=branch%3Amaster+workflow%3Abuild"><img src="https://img.shields.io/github/actions/workflow/status/TKSS-Software/roku-router/build.yml?logo=github&branch=master" alt="Build Status"/></a>
  <a href="https://npmcharts.com/compare/@tkss/roku-router?minimal=true"><img src="https://img.shields.io/npm/dm/@tkss/roku-router.svg?logo=npm" alt="Downloads"/></a>
  <a href="https://www.npmjs.com/package/@tkss/roku-router"><img src="https://img.shields.io/npm/v/@tkss/roku-router.svg?logo=npm" alt="Version"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/TKSS-Software/roku-router.svg" alt="License"/></a>
  <a href="https://join.slack.com/t/rokudevelopers/shared_invite/zt-4vw7rg6v-NH46oY7hTktpRIBM_zGvwA"><img src="https://img.shields.io/badge/Slack-RokuCommunity-4A154B?logo=slack" alt="Slack Community"/></a>
</p>

---

## 🚀 Features

- **URL-style navigation** for Roku apps  
- **Dynamic routing** with parameter support  
- **Route guards** (`canActivate`) for protected screens  
- **View lifecycle hooks** for fine-grained control  
- **Stack management** (root routes, suspension, resume)  
- **Observable router state** for debugging or analytics  

---

## 🧩 Installation

> Requires [Roku Promises](https://github.com/rokucommunity/promises)

Install via **[ropm](https://www.npmjs.com/package/ropm)**:

```bash
npx ropm install promises@npm:@rokucommunity/promises
npx ropm install roku-router@npm:@tkss/roku-router
```

---

## 🧠 Core Concepts

### Route Configuration

A **route** defines how your Roku app transitions between views. Routes are typically registered in your main scene.

Each route object can include:

| Property | Type | Required | Description |
|-----------|-------|-----------|-------------|
| `pattern` | string | ✅ | URL-like path pattern (`"/details/movies/:id"`) |
| `component` | string | ✅ | View component to render (must extend `rokuRouter_View`) |
| `isRoot` | boolean | ❌ | Clears stack and resets breadcrumbs when true |
| `canActivate` | function | ❌ | Guard function to control route access |

### View Lifecycle Methods

Views extending `rokuRouter_View` can define:

- `beforeViewOpen` → Called before the view loads (e.g. async setup, API calls)  
- `onViewOpen` → Called after previous view is closed/suspended  
- `beforeViewClose` → Invoked before a view is destroyed  
- `onViewSuspend` / `onViewResume` → Handle stack suspensions/resumptions  
- `onRouteUpdate` → Fired when navigating to the same route with updated params/hash  
- `handleFocus` → Defines focus handling when the view becomes active  

---

## 🧱 Example: Main Scene Setup

### **MainScene.xml**
```xml
<component name="MainScene" extends="Scene">
    <script type="text/brightscript" uri="pkg:/source/roku_modules/rokurouter/router.brs" />
    <script type="text/brightscript" uri="MainScene.bs" />
    <children>
        <rokuRouter_Outlet id="myOutlet" />
    </children>
</component>
```

### **MainScene.bs**
```brightscript
sub init()
    ' Initialize the router at your main outlet
    rokuRouter.initialize({ outlet: m.top.findNode("myOutlet") })

    rokuRouter.addRoutes([
        { pattern: "/", component: "WelcomeScreen" },
        { pattern: "/shows", component: "CatalogScreen", root: true },
        { pattern: "/movies", component: "CatalogScreen", root: true },
        { pattern: "/details/series/:id", component: "DetailsScreen" },
        { pattern: "/details/series/:id/cast", component: "CastDetailsScreen" },
        { pattern: "/details/movies/:id", component: "DetailsScreen" },
        { pattern: "/details/movies/:id/cast", component: "CastDetailsScreen" },
        { pattern: "/:screenName", component: "DefaultScreen" }
    ])

    rokuRouter.navigateTo("/") ' Go to the welcome view
end sub
```

---

## 👋 Example: Welcome View

### **WelcomeScreen.xml**
```xml
<component name="WelcomeScreen" extends="rokuRouter_View">
    <script type="text/brightscript" uri="pkg:/source/roku_modules/promises/promises.brs" />
    <script type="text/brightscript" uri="WelcomeScreen.bs" />
    <children>
        <Label id="label" />
    </children>
</component>
```

### **WelcomeScreen.bs**
```brightscript
sub init()
    m.label = m.top.findNode("label")
end sub

' Called before the view is shown
function beforeViewOpen(params as dynamic) as dynamic
    m.label.text = "Hello!"
    return promises.resolve(invalid)
end function
```

---

## 🧭 Observing Router State

You can observe `routerState` for debugging or analytics:

```brightscript
sub init()
    rokuRouter.getRouter().observeField("routerState", "onRouterStateChanged")
end sub

sub onRouterStateChanged(event as Object)
    data = event.getData()
    print `Router state changed: ${data.id} ${data.type} ${data.state}`
end sub
```

**Router State Structure:**
```json
{
  "id": "",
  "type": "",
  "state": {
    "routeConfig": {},
    "queryParams": {},
    "routeParams": {},
    "hash": ""
  }
}
```

---

## 🔒 Route Guards

Route guards let you **allow/deny navigation** based on custom logic (e.g., authentication, feature flags).
A guard is simply any node that exposes a `canActivate` function.

### 1) Create a Guard (Auth example)
**`components/Managers/Auth/AuthManager.xml`**
```xml
<?xml version="1.0" encoding="utf-8"?>
<component name="AuthManager" extends="Node">
    <interface>
        <field id="isLoggedIn" type="boolean" value="false" />
        <function name="canActivate" />
    </interface>
</component>
```

**`components/Managers/Auth/AuthManager.bs`**
```brightscript
import "pkg:/source/router.bs"

' Decide whether navigation should proceed.
' Return true to allow, false or a RedirectCommand to block/redirect.
function canActivate(currentRequest = {} as Object) as Dynamic
    if m.top.isLoggedIn then
        return true
    end if

    dialog = createObject("roSGNode", "Dialog")
    dialog.title = "You must be logged in"
    dialog.optionsDialog = true
    dialog.message = "Press * To Dismiss"
    m.top.getScene().dialog = dialog

    ' Redirect unauthenticated users (e.g., to home or login)
    return rokuRouter.createRedirectCommand("/login")
end function
```

### 2) Register the Guard

Create an instance and expose it globally (so routes can reference it):

**`components/Scene/MainScene/MainScene.bs` (snippet)**
```brightscript
' Create AuthManager and attach to globals
m.global.addFields({
    "AuthManager": createObject("roSGNode", "AuthManager")
})

' (Optional) observe auth changes
m.global.AuthManager.observeField("isLoggedIn", "onAuthManagerIsLoggedInChanged")
```

### 3) Protect Routes with `canActivate`

Attach one or more guards to any route using the `canActivate` array:

```brightscript
rokuRouter.addRoutes([
    { pattern: "/", component: "WelcomeScreen", isRoot: true },
    { pattern: "/login", component: "LoginScreen" },

    ' Protected content – requires AuthManager.canActivate to allow
    { pattern: "/shows", component: "CatalogScreen", isRoot: true, canActivate: [ m.global.AuthManager ] },
    { pattern: "/movies", component: "CatalogScreen", isRoot: true, keepRootAlive: true, canActivate: [ m.global.AuthManager ] },
    { pattern: "/details/:type/:id", component: "DetailsScreen", canActivate: [ m.global.AuthManager ] },
    { pattern: "/details/:type/:id/cast", component: "CastDetailsScreen", canActivate: [ m.global.AuthManager ] }
])
```

### 4) What `canActivate` should return

- **`true`** → allow navigation
- **`false`** → block navigation (stay on current view)
- **`RedirectCommand`** → redirect elsewhere without showing the target route
  - Create via `rokuRouter.createRedirectCommand("/somewhere")`

### 5) Accessing the Current Request (optional)

Your guard receives `currentRequest` with the full navigation context, useful for deep-links or conditional flows:

```brightscript
function canActivate(currentRequest as Object) as Dynamic
    ' currentRequest.route.pattern, currentRequest.routeParams, currentRequest.queryParams, currentRequest.hash, etc.
    if currentRequest?.queryParams?.requiresPro = true and not m.top.isProUser then
        return rokuRouter.createRedirectCommand("/upgrade")
    end if
    return true
end function
```

### 6) Example: Feature Flag Guard

You can implement a reusable feature flag guard for gradual rollouts:

```brightscript
function canActivate(currentRequest as Object) as Dynamic
    feature = currentRequest?.routeParams?.feature ' e.g. "/feature/:feature"
    if m.top.getScene().global?.features[feature] = true then
        return true
    end if
    return rokuRouter.createRedirectCommand("/")
end function
```

### 7) Testing Guards Locally

- Toggle login in development: `m.global.AuthManager.isLoggedIn = true`
- Verify redirects by attempting to navigate to a protected route while logged out:
  ```brightscript
  rokuRouter.navigateTo("/shows")
  ```
- Listen to router state changes to confirm block/redirect behavior:
  ```brightscript
  rokuRouter.getRouter().observeField("routerState", "onRouterStateChanged")
  ```

> The included test project already wires up an `AuthManager` and protects `/shows`, `/movies`, and `/details/*` routes using `canActivate`.

---
## 💬 Community & Support

- Join the [Roku Developers Slack](https://join.slack.com/t/rokudevelopers/shared_invite/zt-4vw7rg6v-NH46oY7hTktpRIBM_zGvwA)  
- Report issues or request features via [GitHub Issues](https://github.com/TKSS-Software/roku-router/issues)

---

## 📄 License

Licensed under the [MIT License](LICENSE).
