import styled, { css } from 'styled-components';

export type ButtonVariants = 'primary' | 'secondary' | 'danger';

interface ButtonContainerProps {
    variant: ButtonVariants;
}

const buttonVariants = {
    primary: 'purple',
    secondary: 'pink',
    danger: 'red',
}
/* ${props => css`background-color: ${buttonVariants[props.variant]}`} */
export const ButtonContainer = styled.button<ButtonContainerProps>`
    width: 100px;
    height: 40px;
    border: 0;
    margin-right: 1rem;
    

    background-color: ${props => props.theme.primary}
    
`