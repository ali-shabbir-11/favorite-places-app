import { Ionicons } from '@expo/vector-icons'
import { IconProps } from '@expo/vector-icons/build/createIconSet'
import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Colors } from '../../constants/color'

const OutlinedButton = ({ onPress, icon, children, disabled }: { onPress: () => void,icon: IconProps<any>['name'], children: React.ReactNode, disabled?: boolean }) => {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]} android_ripple={{ color: Colors.primary100 }}>
      <Ionicons
        name={icon}
        size={18}
        color={Colors.primary500}
        style={styles.icon}
      />
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

export default OutlinedButton

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary500,
    margin: 4,
  },
  disabled: {
    opacity: 0.75,
  },
  pressed: {
    opacity: 0.75
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: Colors.primary500,
  }
})