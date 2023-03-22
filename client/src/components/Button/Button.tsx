import React from 'react'
import './Button.scss'

export interface IButtonProps {
  /** Optional button icon */
  icon?: JSX.Element
  /** Optional button label */
  text?: string
  /** Optional function that gets called when button is clicked */
  onClick?: () => any
  /** Optional nodeId prop for a button */
  nodeId?: string
  /**  Optional button background color */
  backgroundColor?: string
}

/**
 * This is the button component. It responds to an onClick event.
 *
 * @param props: IButtonProps
 * @returns Button component
 */
export const Button = ({
  icon,
  text,
  onClick,
  backgroundColor,
}: IButtonProps): JSX.Element => {
  return (
    <div
      className="button"
      onClick={onClick}
      style={{ backgroundColor: backgroundColor && backgroundColor }}
    >
      {icon}
      {text && <span className="text">{text}</span>}
    </div>
  )
}
