things-happened-util
====================

client-side framework for ease access to things happened

## README Contents

- [installation](#a)
- [run tests](#b)
- [build](#c)
- [usage] (#d)

<a name="a"/>
## installation

you need npm and bower:
```
npm install
bower install
```

<a name="b"/>
## run tests

two ways are possible.

### run over grunt

```
grunt test
```

### run over karma
```
karma start src/test/karma.conf.js
```

<a name="c"/>
## build
```
grunt default
```

<a name="d"/>
## usage

Just a small example query yet. See jasmine tests for more examples and visit http://things-happened.org

```js
// get short movies having a title
var query = ThingsQuery.select('movies').whose('title').exists().whose('length').isLowerThan(50);
console.info('http://things-happened.org' + query.url());
```