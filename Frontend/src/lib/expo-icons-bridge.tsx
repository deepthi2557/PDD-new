import React from 'react';
import { Text, View } from 'react-native';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: any;
};

export function FontAwesome({ name, size = 20, color = '#EA4335', style }: IconProps) {
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Text style={{ fontSize: size * 0.85, color, fontWeight: 'bold' }}>
        {name === 'google' ? 'G' : '★'}
      </Text>
    </View>
  );
}

export const Ionicons = FontAwesome;
export const MaterialIcons = FontAwesome;
export const Feather = FontAwesome;
