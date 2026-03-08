import React from 'react'
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native'
import { Colors } from '../../constants/color'

const Button = ({ children, onPress, style }: { children: React.ReactNode, onPress: () => void, style?: StyleProp<ViewStyle> }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 4,
  },
  pressed: {
    opacity : 0.7
  },
  text: {
    color: 'white',
    textAlign: 'center',
  }
})