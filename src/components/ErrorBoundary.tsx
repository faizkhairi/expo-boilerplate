import React, { Component, ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, ButtonText } from '@gluestack-ui/themed';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to structured logging system
    logger.error('ErrorBoundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <View className="flex-1 justify-center items-center bg-white dark:bg-gray-950 px-4">
          <View className="max-w-md w-full space-y-6">
            <View className="space-y-2">
              <Text className="text-2xl font-bold text-gray-900 dark:text-gray-50 text-center">
                Something Went Wrong
              </Text>
              <Text className="text-base text-gray-600 dark:text-gray-400 text-center">
                An unexpected error occurred. Please try again.
              </Text>
            </View>

            {__DEV__ && (
              <ScrollView
                className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg max-h-40"
              >
                <Text className="text-sm font-mono text-red-900 dark:text-red-100">
                  {this.state.error.message}
                </Text>
                {this.state.error.stack && (
                  <Text className="text-xs text-red-700 dark:text-red-300 mt-2">
                    {this.state.error.stack}
                  </Text>
                )}
              </ScrollView>
            )}

            <View className="mt-6">
              <Button onPress={this.resetError} className="w-full">
                <ButtonText>Try Again</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
