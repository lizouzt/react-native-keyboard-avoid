const { findNodeHandle, Keyboard, NativeModules, Platform, Dimensions} = require('react-native');

const PAGEH = Dimensions.get('window').height - (Platform.OS == 'ios' ? 0 : 20);
const recoverList = [];
let keyboardSpace = 0;

const updateKeyboardSpace = (event) => {
    keyboardSpace = Math.floor(event.endCoordinates.height);
}

const resetFunctions = {
    scroll: (item) => {
        if ('scrollToOffset' in item.scrollNodeRef) {
            item.scrollNodeRef.scrollToOffset({offset: item.contentOffset, animated: true});
        } else {
            item.scrollNodeRef.scrollTo({x: 0, y: item.contentOffset, animated: true});
        }
    },
    position: (item) => {
        item.nodeRef.setNativeProps({
            style: {
                bottom: item.bottom
            }
        })
    }
}

const resetKeyboardSpace = () => {
    keyboardSpace = 0;
    recoverList.forEach((item) => {
        resetFunctions.hasOwnProperty(item.behavior) && resetFunctions[item.behavior](item);
    });
    recoverList.length = 0;
}

let keyboardHide, keyboardShow;
let isOn = false;

const initListener = () => {
    isOn = true;
    if (Platform.OS == 'ios') {
        keyboardShow = Keyboard.addListener('keyboardWillShow', updateKeyboardSpace);
        keyboardHide = Keyboard.addListener('keyboardWillHide', resetKeyboardSpace);
    } else {
        keyboardShow = Keyboard.addListener('keyboardDidShow', updateKeyboardSpace);
        keyboardHide = Keyboard.addListener('keyboardDidHide', resetKeyboardSpace);
    }
}

export default {
    unMount: () => {
        if (isOn) {
            keyboardShow.remove();
            keyboardHide.remove();
            isOn = false;
        }
    },
    /*
    *   @param {elements}    
    *   while behavior is scroll {nodeRef, scrollNodeRef, contentOffset}, 
    *   while behavior is position {nodeRef},
    *
    *   @param {behavior}    string:: scroll,position,padding,height
    *   @param {targetScrollOffset}
    * */
    checkNeedScroll: (elements, behavior='scroll', targetScrollOffset=0) => {
        !isOn && initListener();

        const {nodeRef} = elements;
        let handle = findNodeHandle(nodeRef);
        
        NativeModules.UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
            if (behavior == 'scroll') {
                let avoidHeight = keyboardSpace + targetScrollOffset;
                let offset = avoidHeight - (PAGEH - (pageY + height));
                if (offset > 0) {
                    const {scrollNodeRef, contentOffset} = elements;

                    recoverList.push({
                        behavior: behavior,
                        scrollNodeRef: scrollNodeRef,
                        paddingBottom: scrollNodeRef.props.style ? scrollNodeRef.props.style.paddingBottom : 0,
                        contentOffset: contentOffset
                    });

                    if ('scrollToOffset' in scrollNodeRef) {
                        scrollNodeRef.scrollToOffset({offset: offset + contentOffset, animated: true});
                    } else {
                        scrollNodeRef.scrollTo({x: 0, y: offset + contentOffset, animated: true});
                    }
                }
            } else if (behavior == 'position') {
                let bottom = PAGEH - pageY - height;
                let avoidHeight = keyboardSpace + bottom;
                let offset = avoidHeight - bottom;
                
                if (offset > 0) {
                    if (nodeRef.setNativeProps) {
                        recoverList.push({
                            behavior: behavior,
                            nodeRef: nodeRef,
                            bottom: bottom || 0
                        });
                        
                        nodeRef.setNativeProps({
                            style: {
                                bottom: avoidHeight
                            }
                        })
                    } else {
                        console.warn('RCTNode type ', nodeRef.viewConfig.uiViewClassName, ' could not used for KeyboardAvoid.');
                    }
                }
            }
        })
    }
}