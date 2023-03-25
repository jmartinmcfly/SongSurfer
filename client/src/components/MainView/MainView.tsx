import { ChakraProvider } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import NodeGateway from '../../nodes/BackendGateway'
import {} from '../../types'
import { Header } from '../Header'
import { LoadingScreen } from '../LoadingScreen'
import './MainView.scss'

export const MainView = () => {
  // [1] useState hooks
  const [isLoading, setIsLoading] = useState(true)

  // [2] Constant variables
  /** Url for react-router-dom responsive URL */
  const url = useLocation().pathname.slice(0, -1)
  const lastUrlParam = url.substring(url.lastIndexOf('/') + 1)

  // [3] useEffect hooks
  useEffect(() => {}, [])

  // [4] Button handlers
  const example = async (node: any) => {
    /**
     * TODO: Implement this!
     * After you delete the current `selectedNode`
     * what should the new `selectedNode` be?
     * You can use any of the frontend NodeGateway methods here
     * which is why this is an async function!
     *
     * Eg. If you have a `donuts` folder with `chocolate donut`
     * and you delete `chocolate donut` what should the new
     * selected node be?
     */
  }

  // [5] Helper functions
  /** Update our frontend root nodes from the DB */
  const helperExample = async () => {}

  /**
   * [6] JSX component
   *
   * We use a package called Chakra for some our UI components, such as the modal.
   * Feel free to use any packages that you would like in this repository, in fact,
   * we encourage you to play around with this codebase!
   */
  return (
    <ChakraProvider>
      {isLoading ? <LoadingScreen /> : <div className="main-container"></div>}
    </ChakraProvider>
  )
}
