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

## Usage Examples
### Chunk
#### Brightscript
```brightscript
roku-router_chunk(["a", "b", "c", "d"], 2)
```
#### Brighterscript
```brighterscript
roku-router.chunk(["a", "b", "c", "d"], 2)
```
Returns: `[["a", "b"], ["c", "d"]]`


### Compact
#### Brightscript
```brightscript
roku-router_compact([0, 1, false, 2, "", 3])
```
#### Brighterscript
```brighterscript
roku-router.compact([0, 1, false, 2, "", 3])
```
Returns: `[1, 2, 3]`


### Shuffle & Slice
#### Brightscript
```brightscript
roku-router_slice(roku-router_shuffle([1,2,3,4,5,6,7,8,9,10]), 0, 4)
```

#### Brighterscript
```brighterscript
roku-router.slice(roku-router.shuffle([1,2,3,4,5,6,7,8,9,10]), 0, 4)
```
Returns: `[8, 3, 7, 5]`
## Brighterscript Support
If imported into a project that leverages the Brighterscript compiler, you can use roku-router. lookups with auto-complete.
![image](https://user-images.githubusercontent.com/2446955/110862815-30c73900-8296-11eb-8533-4ec1011d7fba.png)


## Development

Currently in development
