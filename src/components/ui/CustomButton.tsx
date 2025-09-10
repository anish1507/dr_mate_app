import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '@utils/Constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  borderRadius?: number;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  borderRadius = RFValue(5), // Default borderRadius
  containerStyle,
  textStyle,
  disabled,
  ...props
}) => {
  // Determine button styles based on variant
  const getButtonStyle = () => {
    const baseStyle = [styles.button, fullWidth && styles.fullWidth, { borderRadius }];
    
    if (disabled) {
      return [...baseStyle, styles.disabled];
    }

    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primaryButton];
      case 'secondary':
        return [...baseStyle, styles.secondaryButton];
      case 'outline':
        return [...baseStyle, styles.outlineButton];
      case 'ghost':
        return [...baseStyle, styles.ghostButton];
      default:
        return baseStyle;
    }
  };

  // Determine text styles based on variant
  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primaryText];
      case 'secondary':
        return [...baseStyle, styles.secondaryText];
      case 'outline':
        return [...baseStyle, styles.outlineText];
      case 'ghost':
        return [...baseStyle, styles.ghostText];
      default:
        return baseStyle;
    }
  };

  // Determine button size
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), getSizeStyle(), containerStyle]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? Colors.white : Colors.primary} 
          size="small" 
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  // Variant styles
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: Colors.disabled,
    opacity: 0.6,
  },
  // Size styles
  smallButton: {
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(12),
  },
  mediumButton: {
    paddingVertical: RFValue(14),
    paddingHorizontal: RFValue(16),
  },
  largeButton: {
    paddingVertical: RFValue(16),
    paddingHorizontal: RFValue(20),
  },
  // Text styles
  text: {
    fontFamily: Fonts.SemiBold,
    fontSize: RFValue(14),
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
  // Content
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: RFValue(5),
  },
});

export default CustomButton;