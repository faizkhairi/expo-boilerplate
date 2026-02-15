import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authAPI } from '../../src/services/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await authAPI.register(data.name, data.email, data.password);
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please sign in.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Failed to create account');
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
            <Text className="text-4xl font-bold text-gray-900 mb-2">Create account</Text>
            <Text className="text-gray-600">Get started for free</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                    placeholder="John Doe"
                    autoCapitalize="words"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.name && (
                <Text className="text-red-500 text-sm mt-1">{errors.name.message}</Text>
              )}
            </View>

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
              <Text className="text-xs text-gray-500 mt-1">Minimum 8 characters</Text>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Confirm Password</Text>
              <Controller
                control={control}
                name="confirmPassword"
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
              {errors.confirmPassword && (
                <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</Text>
              )}
            </View>

            <TouchableOpacity
              className={`bg-blue-600 rounded-lg py-3 items-center ${isLoading ? 'opacity-50' : ''}`}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-base">
                {isLoading ? 'Creating account...' : 'Create account'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-blue-600 font-semibold">Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
