import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface IBurgerButtonProps {
  onClickMenu: (menuState: boolean) => void;
  menuState: boolean;  
} 

export const MenuIcon = ({onClickMenu, menuState}: IBurgerButtonProps) => {
  const [menuOpened, setMenuOpened] = useState<boolean>(menuState)

  useEffect(() => {
    setMenuOpened(menuState)
  }, [menuState])

  return (
    <BurgerButton
      opened={menuOpened}
      onClick={() => {
        onClickMenu(!menuOpened)
        setMenuOpened(!menuOpened)
      }}
    >
      <span />
    </BurgerButton>
  )
}

const BurgerButton = styled.div<{opened: boolean}>`
  width:30px;
  height:20px;
  border:none;
  background:transparent;
  position:relative;
  cursor:pointer;
  margin:20px;

  &:focus {
    outline:none;
  }

  &:after,
  &:before,
  span {
    width:100%;
    height:3px;
    border-radius:100px;
    position:absolute;
    display:block;
    background:${({theme}) => theme.darkFg};
    
  }

  &:after,
  &:before {
    content:"";
    transition: 0.3s width 0.4s;
  }

  &:after {
    top:0px;
    left:0px;
    margin-top:0px;
  }

  &:before {
    bottom:0px;
    right:0px;
    margin-bottom:0px;
  }

  span {
    top:50%;
    margin-top:-2px;
    transition: transform 0.3s ;
      &:before {
        content:"";
        background: ${({theme}) => theme.darkFg};
        width:100%;
        height:3px;
        border-radius:100px;
        position:absolute;
        left:0px;
        transition: transform 0.3s ;
      }
  }

  ${({ opened }) => opened && `
    &:after {
      transition: all 0.2s;
      width:0%;
      left:0px;
    }

    &:before {
      transition: all 0.2s;
      width:0%;
      right:0px;
    }

    span {
      transform:rotate(45deg);
      transition: 0.3s transform 0.4s ;
      &:before {
        transform:rotate(-90deg);
        transition: 0.3s transform 0.4s ;
      }
    }
    `
  }
`