# roact
[Lodash](https://lodash.com/docs/4.17.15) inspired [Brightscript](https://developer.roku.com/en-ca/docs/references/brightscript/language/brightscript-language-reference.md)/[ROPM](https://www.npmjs.com/package/ropm) utility for Roku apps. Currently supporting 150 utility functions!


[![build status](https://img.shields.io/github/workflow/status/TKSS-Software/roact/build.yml?logo=github&branch=master)](https://github.com/TKSS-Software/roact/actions?query=branch%3Amaster+workflow%3Abuild)
[![monthly downloads](https://img.shields.io/npm/dm/@tkss/roact.svg?sanitize=true&logo=npm&logoColor=)](https://npmcharts.com/compare/@tkss/roact?minimal=true)
[![npm version](https://img.shields.io/npm/v/@tkss/roact.svg?logo=npm)](https://www.npmjs.com/package/@tkss/roact)
[![license](https://img.shields.io/github/license/TKSS-Software/roact.svg)](LICENSE)
[![Slack](https://img.shields.io/badge/Slack-RokuCommunity-4A154B?logo=slack)](https://join.slack.com/t/rokudevelopers/shared_invite/zt-4vw7rg6v-NH46oY7hTktpRIBM_zGvwA)



## Important
This project is not affiliated with the Tubitv/roact project.

## Installation
### Using [ropm](https://www.npmjs.com/package/ropm)
```bash
ropm install roact@npm:@tkss/roact
```

## API Documentation (In Progress)
[https://tkss-software.github.io/roact/index.html](https://tkss-software.github.io/roact/index.html)

## Usage Examples
### Chunk
#### Brightscript
```brightscript
roact_chunk(["a", "b", "c", "d"], 2)
```
#### Brighterscript
```brighterscript
roact.chunk(["a", "b", "c", "d"], 2)
```
Returns: `[["a", "b"], ["c", "d"]]`


### Compact
#### Brightscript
```brightscript
roact_compact([0, 1, false, 2, "", 3])
```
#### Brighterscript
```brighterscript
roact.compact([0, 1, false, 2, "", 3])
```
Returns: `[1, 2, 3]`


### Shuffle & Slice
#### Brightscript
```brightscript
roact_slice(roact_shuffle([1,2,3,4,5,6,7,8,9,10]), 0, 4)
```

#### Brighterscript
```brighterscript
roact.slice(roact.shuffle([1,2,3,4,5,6,7,8,9,10]), 0, 4)
```
Returns: `[8, 3, 7, 5]`
## Brighterscript Support
If imported into a project that leverages the Brighterscript compiler, you can use roact. lookups with auto-complete.
![image](https://user-images.githubusercontent.com/2446955/110862815-30c73900-8296-11eb-8533-4ec1011d7fba.png)


## Development

Currently in development
