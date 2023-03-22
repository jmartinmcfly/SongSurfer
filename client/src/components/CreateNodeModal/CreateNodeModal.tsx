import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Input,
  Textarea,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { INode, NodeType, nodeTypes } from '../../types'
import { TreeView } from '../TreeView'
import { TreeWrapper } from '../../types/TreeWrapper'
import { Button } from '../Button'
import './CreateNodeModal.scss'
import { uploadImage, createNodeFromModal } from './createNodeUtils'

export interface ICreateNodeModalProps {
  isOpen: boolean
  onClose: () => unknown
  setSelectedNode: (node: INode) => unknown
  roots: TreeWrapper[]
}

/**
 * Modal for adding a new node; lets the user choose a title, type,
 * and parent node
 */
export const CreateNodeModal = (props: ICreateNodeModalProps) => {
  const { isOpen, onClose, setSelectedNode, roots } = props
  // State variables
  const [selectedParentNode, setSelectedParentNode] = useState<INode | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedType, setSelectedType] = useState<NodeType | string>('')
  const [error, setError] = useState<string>('')

  // Event handlers for the modal inputs and dropdown selects
  const handleSelectedTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value.toLowerCase() as NodeType)
    setContent('')
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleImageContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value)
  }

  const handleTextContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)
  }

  // Called when the "Create" button is clicked
  const handleSubmit = async () => {
    if (!nodeTypes.includes(selectedType)) {
      setError('Error: No type selected')
      return
    }
    if (title.length == 0) {
      setError('Error: No title')
      return
    }
    const attributes = {
      title,
      type: selectedType as NodeType,
      parentNodeId: selectedParentNode != null ? selectedParentNode.nodeId : null,
      content,
    }
    const node = await createNodeFromModal(attributes)
    if (node) {
      setSelectedNode(node)
    }
    handleClose()
  }

  /** Reset all our state variables and close the modal */
  const handleClose = () => {
    onClose()
    setTitle('')
    setSelectedParentNode(null)
    setSelectedType('')
    setContent('')
    setError('')
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const link = files && files[0] && (await uploadImage(files[0]))
    link && setContent(link)
  }

  /** We want to have different content prompts depending on the node type */
  let contentInputPlaceholder: string
  switch (selectedType) {
    case 'text':
      contentInputPlaceholder = 'Text content...'
      break
    case 'image':
      contentInputPlaceholder = 'Image URL...'
      break
    default:
      contentInputPlaceholder = 'Content...'
  }

  const isImage: boolean = selectedType === 'image'
  const isText: boolean = selectedType === 'text'

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new node</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input value={title} onChange={handleTitleChange} placeholder="Title..." />
          <div className="modal-input">
            <Select
              value={selectedType}
              onChange={handleSelectedTypeChange}
              placeholder="Select a type"
            >
              {nodeTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </Select>
          </div>
          {selectedType && isText && (
            <div className="modal-input">
              <Textarea
                value={content}
                onChange={handleTextContentChange}
                placeholder={contentInputPlaceholder}
              />
            </div>
          )}
          {selectedType && isImage && (
            <div className="modal-input">
              <Input
                value={content}
                onChange={handleImageContentChange}
                placeholder={contentInputPlaceholder}
              />
            </div>
          )}
          {selectedType && isImage && (
            <div className="modal-input">
              <input
                type="file"
                onChange={handleImageUpload}
                placeholder={contentInputPlaceholder}
              />
            </div>
          )}
          <div className="modal-section">
            <span className="modal-title">
              <span className="modal-title-tag">Optional</span>
              <div className="modal-title-header">Choose a parent node:</div>
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
            <Button text="Create" onClick={handleSubmit} />
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
