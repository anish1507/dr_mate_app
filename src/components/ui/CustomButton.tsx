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
  Image,
  ImageSourcePropType,
  ImageStyle,
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
  leftImage?: ImageSourcePropType;
  rightImage?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
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
  leftImage,
  rightImage,
  imageStyle,
  fullWidth = true,
  borderRadius = RFValue(5),
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

  // Render icon or image
  const renderIcon = (icon: React.ReactNode | undefined, image: ImageSourcePropType | undefined, position: 'left' | 'right') => {
    if (icon) {
      return <View style={[styles.icon, position === 'right' && styles.rightIcon]}>{icon}</View>;
    }
    
    if (image) {
      return (
        <Image 
          source={image} 
          style={[styles.image, imageStyle, position === 'right' && styles.rightIcon]} 
          resizeMode="contain"
        />
      );
    }
    
    return null;
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
          {renderIcon(leftIcon, leftImage, 'left')}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {renderIcon(rightIcon, rightImage, 'right')}
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
    marginRight: RFValue(8),
  },
  rightIcon: {
    marginRight: 0,
    marginLeft: RFValue(8),
  },
  image: {
    width: RFValue(20),
    height: RFValue(20),
    marginRight: RFValue(8),
  },
});

export default CustomButton;