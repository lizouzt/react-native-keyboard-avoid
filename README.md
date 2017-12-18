# react-native-keyboard-avoid

Component that handles keyboard appearance and automatically make any component node to keep out keyboard.
Work with `TextInput`,`View` and so on.

## Supported versions
- `v1.0.0` requires `RN>=0.20`

## Installation
Installation can be done through ``npm`` or `yarn`:

```shell
npm i react-native-keyboard-avoid --save
```

```shell
yarn add react-native-keyboard-avoid
```

## Usage
You just need use this `KeyboardAvoid` on whatever you want to keep out from native keyboard view.
It accept `ScrollView`, `ListView`, `FlatList` and any other `View` component. There will show you 3 example.

#### 1.With something in `ScrollView` or `ListView`, `FlatList`

<p align="center">
<img src="https://raw.githubusercontent.com/lizouzt/react-native-keyboard-avoid/master/Input.gif" width="375">
</p>

```js
import KeyboardAvoid from 'react-native-keyboard-avoid';

_onFocus () {
	KeyboardAvoid.checkNeedScroll({
	    nodeRef: this.titleInput, 		    //TextInput ref
	    scrollNodeRef: this.scrollView,     //ScrollView ref
	    contentOffset: this.contentOffset   //ScrollView scrollOffset.y
	}, 'scroll', 0);
}
```

```jsx
<ScrollView 
    ref={(ref) => this.scrollView = ref}
    style={{flex: 1}}
    scrollEventThrottle={3}
    onScroll={(event) => {this.contentOffset = event.nativeEvent.contentOffset.y}}>

    <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <TextInput
            style={BaseStyles.textInputBase}
            ref={(ref) => this.titleInput = ref}
            returnKeyType={"search"}
            onFocus={() => this._onFocus()}/>
        <Button style={[BaseStyles.iconBase, {margin: 5, color: '#333'}]}>Search</Button>
    </View>
</ScrollView>

or 

<FlatList
    ref={(ref) => this.scrollView = ref}
    onScroll={(event) => {this.contentOffset = event.nativeEvent.contentOffset.y;}}/>
```

#### 2.With component which use position: 'absolute'

<p align="center">
<img src="https://raw.githubusercontent.com/lizouzt/react-native-keyboard-avoid/master/View.gif" width="375">
</p>

```js
import KeyboardAvoid from 'react-native-keyboard-avoid';

_onPress () {
	this.aTextInput.focus();
	KeyboardAvoid.checkNeedScroll({
       nodeRef: this.footer
   }, 'position', 0);
}
```

```jsx
<View ref={(ref) => this.footer = ref}
    style={{
        width: config.width, 
        position: 'absolute', 
        bottom: 0, 
        height: 50,
        backgroundColor: 'lightblue',
        zIndex: 4
    }}>
    <TouchableOpacity onPress={() => this._onPress()}>
    	<Text style={{color: 'white', lineHeight: 50}}>浮低</Text>
    </TouchableOpacity>
</View>
```

#### 3.With two components one use position and one use scroll
<p align="center">
<img src="https://raw.githubusercontent.com/lizouzt/react-native-keyboard-avoid/master/both.gif" width="375">
</p>

```js
import KeyboardAvoid from 'react-native-keyboard-avoid';

_onPressAndFocus () {
	KeyboardAvoid.checkNeedScroll({
        nodeRef: this.titleInput, 
        scrollNodeRef: this.scrollView, 
        contentOffset: this.contentOffset
    }, 'scroll', 50);
    KeyboardAvoid.checkNeedScroll({
        nodeRef: this.footer
    }, 'position');
}
```


### Methods

| **Method** | **Parameter** | **Description** |
|------------|---------------|-----------------|
| `checkNeedScroll` | `(params, type='scroll', offset=0)` | Get `ScrollResponder` |
| `unMount` | none | unMount this handler while app view unMount |

## API
`KeyboardAvoid.checkNeedScroll(params, type='scroll', offset=0)`
### Prame

#### params {object}
| **Prop** | **Type** | **Description** |
|----------|----------|-----------------|
| `nodeRef ` | Node Ref | ref of the component which need to avoid from keyboard |
| `scrollNodeRef ` | Node Ref | ref of scroll component |
| `contentOffset ` | Node Ref | scrolloffset.y of scroll component |

#### type {string}
| **value** | **Description** |
|----------|----------|
| `scroll` | Such as example 1. keyboard avoid in `ScrollView` or `ListView`, `FlatList` |
| `position ` | Such as example 2. keyboard avoid with position |

#### offset {number} 
target offset from the top of keyboard
`onScroll={(event) => {this.contentOffset = event.nativeEvent.contentOffset.y}}`


## License MIT