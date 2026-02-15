import {
  Input as GlueInput,
  InputField,
  InputSlot,
  InputIcon,
} from '@gluestack-ui/themed'
import type { ComponentProps } from 'react'

type InputProps = ComponentProps<typeof GlueInput> & {
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  secureTextEntry?: boolean
  icon?: React.ReactNode
}

/**
 * Styled input component using gluestack-ui
 *
 * @example
 * ```tsx
 * <Input
 *   placeholder="Email"
 *   value={email}
 *   onChangeText={setEmail}
 * />
 * ```
 */
export function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  icon,
  ...props
}: InputProps) {
  return (
    <GlueInput variant="outline" {...props}>
      <InputField
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {icon && <InputSlot pr="$3">{icon}</InputSlot>}
    </GlueInput>
  )
}
