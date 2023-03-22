import { ChakraProvider } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { makeRootWrapper } from '.'
import NodeGateway from '../../nodes/NodeGateway'
import { INode, NodeIdsToNodes } from '../../types'
import { TreeWrapper } from '../../types/TreeWrapper'
import { CreateNodeModal } from '../CreateNodeModal'
import { Header } from '../Header'
import { LoadingScreen } from '../LoadingScreen'
import { MoveNodeModal } from '../ModeNodeModal'
import { NodeView } from '../NodeView'
import { TreeView } from '../TreeView'
import './MainView.scss'
import { createNodeIdsToNodesMap, emptyNode } from './mainViewUtils'

export const MainView = () => {
  // [1] useState hooks
  const [selectedNode, setSelectedNode] = useState<INode | null>(null)
  const [createNodeModalIsOpen, setCreateNodeModalIsOpen] = useState(false)
  const [moveNodeModalIsOpen, setMoveNodeModalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [rootNodes, setRootNodes] = useState<TreeWrapper[]>([new TreeWrapper(emptyNode)])

  // [2] Constant variables
  /** Map each nodeId to its INode object for easy access */
  const nodeIdsToNodes: NodeIdsToNodes = createNodeIdsToNodesMap(rootNodes)
  /** Url for react-router-dom responsive URL */
  const url = useLocation().pathname.slice(0, -1)
  const lastUrlParam = url.substring(url.lastIndexOf('/') + 1)
  /** TreeWrapper for TreeView which contains root nodes */
  const rootTreeWrapper: TreeWrapper = makeRootWrapper(rootNodes)

  // [3] useEffect hooks
  useEffect(() => {
    async function fetchNodeFromUrl() {
      const fetchResp = await NodeGateway.getNode(lastUrlParam)
      if (fetchResp.success) {
        setSelectedNode(fetchResp.payload)
      }
    }
    if (lastUrlParam.length) {
      fetchNodeFromUrl()
    }
  }, [lastUrlParam])

  /** When selectedNode changes, we want to re-load the node tree from the DB */
  useEffect(() => {
    loadRootsFromDB()
  }, [selectedNode])

  // [4] Button handlers
  const handleDeleteButtonClick = async (node: INode) => {
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

  const handleHomeClick = () => {
    setSelectedNode(null)
  }

  // [5] Helper functions
  /** Update our frontend root nodes from the DB */
  const loadRootsFromDB = async () => {
    const rootsFromDB = await NodeGateway.getRoots()
    if (rootsFromDB.success) {
      rootsFromDB.payload && setRootNodes(rootsFromDB.payload)
      setIsLoading(false)
    }
  }

  /** Return the children of the selectedNode */
  const selectedNodeChildren = () => {
    if (!selectedNode) return undefined
    return selectedNode.filePath.children.map(
      (childNodeId) => nodeIdsToNodes[childNodeId]
    )
  }

  /**
   * [6] JSX component
   *
   * We use a package called Chakra for some our UI components, such as the modal.
   * Feel free to use any packages that you would like in this repository, in fact,
   * we encourage you to play around with this codebase!
   */
  return (
    <ChakraProvider>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="main-container">
          <Header
            onHomeClick={handleHomeClick}
            onCreateButtonClick={() =>
              setCreateNodeModalIsOpen(true)
            }
          />
          <CreateNodeModal
            isOpen={createNodeModalIsOpen}
            onClose={() => setCreateNodeModalIsOpen(false)}
            setSelectedNode={setSelectedNode}
            roots={rootNodes}
          />
          {selectedNode && (
            <MoveNodeModal
              isOpen={moveNodeModalIsOpen}
              onClose={() => setMoveNodeModalIsOpen(false)}
              onSubmit={loadRootsFromDB}
              setSelectedNode={setSelectedNode}
              node={selectedNode}
              roots={rootNodes}
            />
          )}
          <div className="content">
            <div className="nodeBrowser-wrapper">
              <TreeView
                roots={rootNodes}
                selectedNode={selectedNode}
                setSelected={setSelectedNode}
              />
            </div>
            <div className="nodeView-wrapper">
              <NodeView
                childNodes={
                  selectedNode
                    ? selectedNodeChildren()
                    : rootNodes.map((root) => root.node)
                }
                setSelected={setSelectedNode}
                folderContentType={'grid'}
                node={selectedNode ? selectedNode : rootTreeWrapper.node}
                onDeleteButtonClick={handleDeleteButtonClick}
                onMoveButtonClick={() => setMoveNodeModalIsOpen(true)}
                nodeIdsToNodes={nodeIdsToNodes}
              />
            </div>
          </div>
        </div>
      )}
    </ChakraProvider>
  )
}
