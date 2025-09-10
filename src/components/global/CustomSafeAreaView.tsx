import { FC, ReactNode } from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';

interface CustomSafeAreaViewProps {
  children: ReactNode;
  style?: ViewStyle;
}

const CustomSafeAreaView: FC<CustomSafeAreaViewProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Keeps notch area white
  },
});

export default CustomSafeAreaView;
