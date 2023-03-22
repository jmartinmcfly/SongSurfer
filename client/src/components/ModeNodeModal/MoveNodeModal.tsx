import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { INode } from '../../types'
import { TreeView } from '../TreeView'
import { TreeWrapper } from '../../types/TreeWrapper'
import { Button } from '../Button'
import NodeGateway from '../../nodes/NodeGateway'
import './MoveNodeModal.scss'

// NOTE: unknown is the type safe version of any
export interface IMoveNodeModalProps {
  isOpen: boolean
  onClose: () => unknown
  node: INode
  roots: TreeWrapper[]
  setSelectedNode: (node: INode | null) => unknown
  /** Executed when the use clicks the "Move" button */
  onSubmit: () => unknown
}

/**
 * Modal for moving a node to a new location
 */
export const MoveNodeModal = (props: IMoveNodeModalProps) => {
  const { isOpen, onClose, onSubmit, setSelectedNode, node, roots } = props
  // State variables
  const [selectedParentNode, setSelectedParentNode] = useState<INode | null>(null)
  const [error, setError] = useState<string>('')

  // Called when the "Move" button is clicked
  const handleSubmit = async ({ root }: { root: boolean }) => {
    let newParentId: string
    if (root) {
      newParentId = selectedParentNode != null ? selectedParentNode.nodeId : '~'
    } else {
      newParentId = '~'
    }
    if (!root && selectedParentNode?.nodeId == node.nodeId) {
      setError('Error: Cannot move into itself')
    } else if (!root && selectedParentNode?.filePath.path.includes(node.nodeId)) {
      setError('Error: Cannot move into children')
    } else {
      const moveNodeResp = await NodeGateway.moveNode({
        nodeId: node.nodeId,
        newParentId: newParentId,
      })
      if (moveNodeResp.success) {
        const movedNode = moveNodeResp.payload
        setSelectedNode(movedNode)
      } else {
        setError('Error: ' + moveNodeResp.message)
      }
      onSubmit()
      handleClose()
    }
  }

  // Reset our state variables and close the modal
  const handleClose = () => {
    onClose()
    setSelectedParentNode(null)
    setError('')
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Moving {`"${node.title}"`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="modal-input">
            <span className="modal-title">
              <span className="modal-title-tag">Optional</span>
              <div className="modal-title-header">Choose a new parent node:</div>
            </span>
            <div className="modal-treeView">
              <TreeView
                roots={roots}
                selectedNode={selectedParentNode}
                setSelected={setSelectedParentNode}
                linkTo={false}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {error.length > 0 && <div className="modal-error">{error}</div>}
          <div className="modal-footer-buttons">
            <Button
              text={selectedParentNode ? 'Move to selected node' : 'Move to root'}
              onClick={() => handleSubmit({ root: !!selectedParentNode })}
            />
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
