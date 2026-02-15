import { ButtonText, Button as GlueButton } from '@gluestack-ui/themed'
import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<typeof GlueButton> & {
  title: string
  variant?: 'solid' | 'outline' | 'link'
}

/**
 * Styled button component using gluestack-ui
 *
 * @example
 * ```tsx
 * <Button title="Click me" onPress={() => console.log('Pressed')} />
 * <Button title="Outline" variant="outline" />
 * ```
 */
export function Button({ title, variant = 'solid', ...props }: ButtonProps) {
  return (
    <GlueButton variant={variant} {...props}>
      <ButtonText>{title}</ButtonText>
    </GlueButton>
  )
}
