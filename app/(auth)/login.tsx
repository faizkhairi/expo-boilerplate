import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../src/stores/auth';
import { authAPI } from '../../src/services/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data.email, data.password);
      await login(response.token, response.user);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-6 bg-white">
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-900 mb-2">Welcome back</Text>
            <Text className="text-gray-600">Sign in to your account</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                    placeholder="••••••••"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
              )}
            </View>

            <TouchableOpacity
              className={`bg-blue-600 rounded-lg py-3 items-center ${isLoading ? 'opacity-50' : ''}`}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-base">
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 font-semibold">Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
