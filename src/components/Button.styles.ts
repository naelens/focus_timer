import styled from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonContainerProps {
    $variant: ButtonVariant;
}

const buttonVariants = {
    primary: 'purple',
    secondary: 'pink',
    danger: 'red',
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
    width: 100px;
    height: 40px;
    border-radius: 4px;
    border: 0;
    margin: 1rem;
    
    background: ${props => props.theme['green-700']};
    color: ${props => props.theme.white};
    border: ${props => buttonVariants[props.$variant]};
`