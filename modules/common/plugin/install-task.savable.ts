import AsyncStorage from '@react-native-async-storage/async-storage'
import type { DownloadPauseState } from 'expo-file-system'
import { ToastAndroid } from 'react-native'

import i18n from '@/i18n'
import { i18nKeys } from '@/i18n/keys'
import { logger } from '@/libs/logger'
import { PluginDetail } from '@/modules/tabs/registry/store'

import { InstallTask } from './install-task'
import { InstallTaskState } from './install-task.type'

/**
 * const
 */
const MAX_SAVABLE_NUM = 5

type Options = {
  interval: number
}
const DEFAULT_OPTIONS: Options = {
  interval: 3000,
}

type TaskSavable = {
  p: PluginDetail
  o: DownloadPauseState
}

/**
 * setInterval to save task
 */
export function TaskSavableDecorator(
  task: InstallTask,
  options?: Options
): InstallTask {
  if (!checkCanSaveTask()) return task

  const { interval } = { ...DEFAULT_OPTIONS, ...options }
  const timer = setInterval(async () => {
    // only need to save when downloading
    if (task.state === InstallTaskState.DOWNLOADING) {
      // user don't know
      await task.downloadResumable.pauseAsync()
      // must pause before save
      saveTask(task)
      // after save, silently resume
      await task.downloadResumable.resumeAsync()
    }
  }, interval)

  // don't clean when "error", because we don't remove task
  // user can still resume task
  task.once(['download:finish', 'cancel'], async () => {
    clearInterval(timer)
    await AsyncStorage.removeItem(taskSavableKey(task.plugin.pluginId))
  })

  // save once immediately
  saveTask(task)

  return task
}

/**
 * recover saved task from AsyncStorage
 */
export async function recoverSavedTask(): Promise<TaskSavable[]> {
  const ret: TaskSavable[] = []
  const keys = await AsyncStorage.getAllKeys()
  for (const key of keys) {
    if (isTaskSavableKey(key)) {
      const savableStr = (await AsyncStorage.getItem(key)) ?? ''
      try {
        const savable: TaskSavable = JSON.parse(savableStr)
        ret.push(savable)
      } catch (e) {
        logger.warn(`parse TaskSavable error: key=${key}, str=${savableStr}`)
      }
    }
  }

  if (ret.length > 0) {
    ToastAndroid.show(
      `${ret.length} ${i18n.t(i18nKeys.TOAST_RECOVER_TASK)}`,
      ToastAndroid.SHORT
    )
  }

  return ret
}

export async function checkCanSaveTask(): Promise<boolean> {
  const savedTaskNum = (await AsyncStorage.getAllKeys()).filter((key) =>
    isTaskSavableKey(key)
  ).length
  if (savedTaskNum >= MAX_SAVABLE_NUM) {
    ToastAndroid.show(
      i18n.t(i18nKeys.TOAST_TOO_MANY_SAVABLE),
      ToastAndroid.SHORT
    )
    return false
  }
  return true
}

/**
 * utils
 */
export function taskSavableKey(pluginId: string): string {
  return `task:${pluginId}`
}
export function isTaskSavableKey(key: string): boolean {
  return key.startsWith('task:')
}

async function saveTask(task: InstallTask) {
  try {
    const savable: TaskSavable = {
      p: task.plugin,
      o: task.downloadResumable.savable(),
    }
    await AsyncStorage.setItem(
      taskSavableKey(task.plugin.pluginId),
      JSON.stringify(savable)
    )
    logger.debug('task saved:', savable)
  } catch (e) {
    logger.warn(`task save error: task=${task.plugin.pluginId}`, e)
  }
}
