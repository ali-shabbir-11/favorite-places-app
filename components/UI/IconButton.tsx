import { Ionicons } from '@expo/vector-icons'
import { IconProps } from '@expo/vector-icons/build/createIconSet'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'

const IconButton = ({ icon, size, color, onPress, style }: { icon: IconProps<any>['name'], size: number, color?: string, onPress: () => void, style?: StyleProp<ViewStyle> }) => {

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}>
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  )
}

export default IconButton

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  pressed: {
    opacity: 0.75
  }
})