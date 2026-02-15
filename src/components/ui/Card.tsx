import { Box, Heading, Text } from '@gluestack-ui/themed'
import type { ComponentProps, ReactNode } from 'react'

type CardProps = ComponentProps<typeof Box> & {
  title?: string
  description?: string
  children?: ReactNode
}

/**
 * Card container component using gluestack-ui
 *
 * @example
 * ```tsx
 * <Card title="Welcome" description="Get started with the app">
 *   <Button title="Continue" />
 * </Card>
 * ```
 */
export function Card({ title, description, children, ...props }: CardProps) {
  return (
    <Box
      bg="$white"
      borderRadius="$lg"
      borderWidth={1}
      borderColor="$gray200"
      p="$4"
      shadowColor="$gray900"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      elevation={2}
      {...props}
    >
      {title && (
        <Heading size="md" mb="$2">
          {title}
        </Heading>
      )}
      {description && (
        <Text size="sm" color="$gray600" mb="$4">
          {description}
        </Text>
      )}
      {children}
    </Box>
  )
}
