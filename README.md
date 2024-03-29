# dok-lib

## Demo
https://jacklehamster.github.io/dok-actions/example/build/

## Overview

Initial interpreter for executing NAPL language (or at least the first version of it).
Commands can be executed by updating the "scripts" object.

Support for:
- actions
- parameters
- callbacks
- callExternal
- hooks
- log
- loop
- condition
- whileCondition
- loopEach
- delay
- pause
- lock
- unlock
- reference
- refresh
- executeScript
- set
- sets
- defaultValues


> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/dok-lib.svg)](https://www.npmjs.com/package/dok-lib) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save dok-lib
```

## Usage

```tsx
import React, { Component } from 'react'

import MyComponent from 'dok-lib'
import 'dok-lib/dist/index.css'

class Example extends Component {
  render() {
    return <MyComponent />
  }
}
```

## License

MIT © [jacklehamster](https://github.com/jacklehamster)

