// @ts-check

let settings = {};

function setAllSettings (newSettings) {
    settings = newSettings;
}

function setSetting (settingName, value) {
    settings[settingName] = value;
}

export { settings, setSetting, setAllSettings };
