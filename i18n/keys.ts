// @TODO need to be more elegant
export const i18nKeys = {
  /**
   * TITLE
   */
  TITLE_HOME: 'TITLE_HOME',
  TITLE_REGISTRY: 'TITLE_REGISTRY',
  TITLE_PROGRESS: 'TITLE_PROGRESS',

  /**
   * TOAST
   */
  TOAST_INSTALL_START: 'TOAST_INSTALL_START',
  TOAST_INSTALL_SUCCESS: 'TOAST_INSTALL_SUCCESS',
  TOAST_TOO_MANY_SAVABLE: 'TOAST_TOO_MANY_SAVABLE',
  TOAST_RECOVER_TASK: 'TOAST_RECOVER_TASK',
  /**
   * TEXT
   */
  TEXT_NO_PLUGIN_1: 'TEXT_NO_PLUGIN_1',
  TEXT_NO_PLUGIN_2: 'TEXT_NO_PLUGIN_2',
  TEXT_NO_INSTALL_TASK: 'TEXT_NO_INSTALL_TASK',
  TEXT_MISSING_PLUGIN_NAME: 'TEXT_MISSING_PLUGIN_NAME',
  TEXT_UNINSTALL: 'TEXT_UNINSTALL',
}

export type i18nTranslation = {
  [k in keyof typeof i18nKeys]: string
}
