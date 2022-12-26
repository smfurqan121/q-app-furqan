function setTheme(theme) {
    console.log('theme inside setTheme action', theme)
    return {
        type: 'SET_THEME',
        data: theme
    }
}

function removeTheme() {
    return {
        type: 'REMOVE_THEME'
    }
}

export {
    setTheme,
    removeTheme
}