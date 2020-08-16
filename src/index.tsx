import { useCallback, useEffect, useState } from 'react'
import { initGTM, sendToGTM } from 'utils/GoogleTagManager'

import { ISnippetsParams } from 'models/GoogleTagManager'

declare global {
  interface Window {
    dataLayer: Object | undefined
    [key: string]: any
  }
}

/**
 * The shape of the hook
 */
export type IUseGTM = {
  init({ dataLayer, dataLayerName, id }: ISnippetsParams): void
  sendDataToGTM(data: Object): void
}

/**
 * The Google Tag Manager Hook
 */
export default function useGTM(): IUseGTM {
  const initialState: ISnippetsParams = {
    dataLayer: undefined,
    dataLayerName: 'dataLayer',
    id: ''
  }

  const [dataLayerState, setDataLayerState] = useState<ISnippetsParams>(initialState)

  const init = useCallback(
    ({
      dataLayer = initialState.dataLayer,
      dataLayerName = initialState.dataLayerName,
      id = initialState.id
    }: ISnippetsParams): void => setDataLayerState({ dataLayer, dataLayerName, id }),
    [initialState]
  )

  const sendDataToGTM = useCallback(
    (data: Object): void => sendToGTM({ data, dataLayerName: dataLayerState.dataLayerName! }),
    [dataLayerState]
  )

  useEffect(() => {
    if (dataLayerState.id !== '') {
      initGTM({
        dataLayer: dataLayerState.dataLayer,
        dataLayerName: dataLayerState.dataLayerName,
        id: dataLayerState.id
      })
    }
  }, [dataLayerState])

  return {
    init,
    sendDataToGTM
  }
}
