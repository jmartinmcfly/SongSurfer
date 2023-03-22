import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react'
import React, { ReactElement } from 'react'

interface IPopoverProps {
  content: ReactElement<any, any>
  trigger: ReactElement
  header?: string
}

export const PopoverMenu = ({ content, trigger, header }: IPopoverProps) => {
  return (
    <div>
      <Popover>
        <PopoverTrigger>{trigger}</PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          {header && <PopoverHeader>{header}</PopoverHeader>}
          <PopoverBody>{content}</PopoverBody>
        </PopoverContent>
      </Popover>
    </div>
  )
}
