import { findNodeHandle, Keyboard, NativeModules} from'react-native';

let keyboardSpace = 0;

const recoverList = [];
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

if (config.platform == 'ios') {
    keyboardShow = Keyboard.addListener('keyboardWillShow', updateKeyboardSpace);
    keyboardHide = Keyboard.addListener('keyboardWillHide', resetKeyboardSpace);
} else {
    keyboardShow = Keyboard.addListener('keyboardDidShow', updateKeyboardSpace);
    keyboardHide = Keyboard.addListener('keyboardDidHide', resetKeyboardSpace);
}

export default {
    unMount: () => {
        keyboardShow.remove();
        keyboardHide.remove();
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
        const {nodeRef} = elements;
        const handle = findNodeHandle(nodeRef);

        NativeModules.UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
            if (behavior == 'scroll') {
                const avoidHeight = keyboardSpace + targetScrollOffset;
                const offset = avoidHeight - (config.height - (pageY + height));
                if (offset > 0) {
                    const {scrollNodeRef, contentOffset} = elements;

                    recoverList.push({
                        behavior: behavior,
                        scrollNodeRef: scrollNodeRef,
                        paddingBottom: scrollNodeRef.props.style.paddingBottom,
                        contentOffset: contentOffset
                    });

                    if ('scrollToOffset' in scrollNodeRef) {
                        scrollNodeRef.scrollToOffset({offset: offset + contentOffset, animated: true});
                    } else {
                        scrollNodeRef.scrollTo({x: 0, y: offset + contentOffset, animated: true});
                    }
                }
            } else if (behavior == 'position') {
                const avoidHeight = keyboardSpace - (config.height - pageY - height);
                const offset = avoidHeight - (config.height - (pageY + height));

                if (offset > 0) {
                    if (nodeRef.setNativeProps) {
                        config.height - pageY - height

                        recoverList.push({
                            behavior: behavior,
                            nodeRef: nodeRef,
                            bottom: nodeRef.props.style.bottom
                        });
                        nodeRef.setNativeProps({
                            style: {
                                bottom: avoidHeight
                            }
                        })
                    } else {
                        console.warn('RCTNode ', nodeRef, ' could not used for KeyboardAvoid.');
                    }
                }
            }
        })
    }
}