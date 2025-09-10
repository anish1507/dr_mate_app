import { View, StyleSheet, TextInput } from 'react-native';
import React, { FC } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '@utils/Constants';

interface InputProps {
  left?: React.ReactNode;
}

const CustomInput: FC<InputProps & React.ComponentProps<typeof TextInput>> = ({
  left,
  ...props
}) => {
  return (
    <View style={styles.flexRow}>
      {left && <View style={styles.iconContainer}>{left}</View>}
      <TextInput
        {...props}
        style={styles.inputContainer}
        placeholderTextColor="#ccc"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1, // fill remaining space
    fontFamily: Fonts.SemiBold,
    fontSize: RFValue(12),
    paddingVertical: 14,
    color: Colors.text,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 5,
    width: '100%',
    marginVertical: 10,
    backgroundColor: Colors.primary_dark,
    borderColor: Colors.primary_light,
    paddingHorizontal: 10,
  },
  iconContainer: {
    marginRight: 10, // spacing between icon and text
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomInput;
