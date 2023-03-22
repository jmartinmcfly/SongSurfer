import React from 'react'
import * as fa from 'react-icons/fa'
import { Button } from '../Button'
import './Header.scss'

interface HeaderProps {
  onHomeClick: () => unknown
  onCreateButtonClick: () => unknown
}

export const Header = (props: HeaderProps) => {
  const { onCreateButtonClick, onHomeClick } = props
  return (
    <div className="header">
      <div className="name">
        My<b>Hypermedia</b>
      </div>
      <Button icon={<fa.FaHome />} onClick={onHomeClick} />
      <Button icon={<fa.FaPlus />} onClick={onCreateButtonClick} />
    </div>
  )
}
