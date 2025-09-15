import { View, StyleSheet, TextInput } from 'react-native';
import React, { FC } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '@utils/Constants';

interface InputProps {
  left?: React.ReactNode;
  backgroundColor?: string;   // custom background color
  outlineColor?: string;      // custom outline/border color
  textColor?: string;         // custom text color
  placeholderColor?: string;  // custom placeholder text color
}

const CustomInput: FC<InputProps & React.ComponentProps<typeof TextInput>> = ({
  left,
  backgroundColor = Colors.primary_dark,
  outlineColor = Colors.primary_light,
  textColor = Colors.text,
  placeholderColor = "#ccc",
  ...props
}) => {
  return (
    <View style={[styles.flexRow, { backgroundColor, borderColor: outlineColor }]}>
      {left && <View style={styles.iconContainer}>{left}</View>}
      <TextInput
        {...props}
        style={[styles.inputContainer, { color: textColor }]} // ✅ text color applied
        placeholderTextColor={placeholderColor}              // ✅ placeholder color applied
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    fontFamily: Fonts.SemiBold,
    fontSize: RFValue(12),
    paddingVertical: 14,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,   // outline thickness
    borderRadius: 5,
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  iconContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomInput;
