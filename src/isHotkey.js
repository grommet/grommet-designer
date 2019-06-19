import Keycode from 'keycode';



/**
 * Checks modifier key name and converts `Meta` to `Meta` on Mac and `Control` elsewhere.
 * 
 * Logs an error and returns an empty string if the modifier key is unknown.
 * 
 * `Meta`, `Control`, `Alt`, `Shift` are supported.
 *
 * @param {string} keyName - key name like `Shift` or `Meta`
 * @param {string} [platform] - (optional) defaults to `navigator.platform`
 * @return {string} Native modifier key name that can be used for event filtering
 */
export function translateModifierKey(keyName, platform = navigator.platform) {
    const supportedModifierKeys = [`Meta`, `Control`, `Alt`, `Shift`];
    if (!supportedModifierKeys.includes(keyName)) {
        console.error(`Unsupported modifier key: ${keyName}`);
        return ''
    }
    if (keyName === "Meta") {
        return /Mac|iPod|iPhone|iPad/.test(platform) ? 'Meta' : 'Control';
    }
    return keyName;
}
/**
 * Extracts an list of native key names from a shortcut.
 * @param {string} shortcut keyboard shourtcut such as `Alt+Shift+e` (case-sensitive, no spaces allowed)
 * @param {boolean} [exclude] (optional) inverse logic: return only keys that are not modifiers instead
 * @returns {[string]} array of modifier keys to be pressed together
 */
export function filterModifiers(shortcut, exclude = false) {
    const modifiers = [`Alt`, `AltGraph`, `Shift`, `CapsLock`, `Control`, `Meta`, `NumLock`, `OS`, `ScrollLock`]
    const lowModifiers = modifiers.map(m => m.toLowerCase())
    const keys = shortcut
        .split('+').map(k => k.toLowerCase())
        .map(k => ((k || '+').trim()) || ' ') // treat things like "Control +" and "Control+" as `Control` and `+` together
    if (exclude) {
        return keys.filter(k => !lowModifiers.includes(k));
    }
    else {
        return modifiers.filter(m => keys.includes(m.toLowerCase()));
    }
}


/**
 * Check if a modifier key is pressed
 * Checks for if no `modifier` argument is provided
 *
 * @param {KeyboardEvent} event - onKeyDown event
 * @param {string} shortcut - Keyboard shortcut like `Meta+e` or `Shift+x`, case-sensitive
 * @param {boolean} [ignoreFields] - (optional) disable the shortcut inside editable fields like `Textarea` or `Input`, defaults to false
 * @return {boolean} `true` if modifier key is pressed, else `false`
 */
export function isHotkey(event, shortcut, ignoreFields = false) {
    const needKeys = filterModifiers(shortcut, true);
    if (needKeys.length !== 1) {
        console.error(`Invalid shortcut "${shortcut}": multiple normal keys not allowed`);
        return false;
    }
    const needKey = needKeys[0];
    if (!Keycode.isEventKey(event, needKey)) {
        return false;
    }

    const target = event.target || event.srcElement;
    const tagName = target.tagName;
    const isField = target.isContentEditable ||
        ((tagName === 'INPUT' || tagName === 'TEXTAREA') && !target.readOnly);
    if (isField && ignoreFields) {
        return false;
    }

    const modifiersPressed = filterModifiers(shortcut);
    const allModifiersPressed = modifiersPressed.every(m => event.getModifierState(translateModifierKey(m)));
    if (!allModifiersPressed) {
        return false;
    }

    return true
}

export default isHotkey;