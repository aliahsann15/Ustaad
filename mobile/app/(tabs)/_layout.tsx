import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { theme } from '../../constants/theme';
import { Typography } from '../../components/Typography';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ICONS: Record<string, any> = {
  index: require('../../assets/icons/house.svg'),
  activity: require('../../assets/icons/history.svg'),
  profile: require('../../assets/icons/user-round.svg'),
  more: require('../../assets/icons/circle-ellipsis.svg'),
};

const TabItem = ({ route, isFocused, onPress, index, total, options }: any) => {
  const flex = useSharedValue(isFocused ? 1.5 : 1);
  const labelOpacity = useSharedValue(isFocused ? 1 : 0);
  const labelWidth = useSharedValue(isFocused ? 60 : 0);

  useEffect(() => {
    flex.value = withTiming(isFocused ? 1.5 : 1, { duration: 250 });
    labelOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 250 });
    labelWidth.value = withTiming(isFocused ? 60 : 0, { duration: 250 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({ flex: flex.value }));
  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    width: labelWidth.value,
    marginLeft: labelWidth.value > 0 ? 8 : 0,
  }));

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.tabItem, animatedStyle, index < total - 1 && styles.divider]}
    >
      <View style={[styles.tabContainer, isFocused && styles.tabContainerFocused]}>
        <Image 
          source={ICONS[route.name] || ICONS.more} 
          style={{ width: 22, height: 22 }}
          tintColor={isFocused ? theme.colors.primary : '#FFFFFF'}
        />
        <Animated.View style={[labelStyle, { overflow: 'hidden', justifyContent: 'center' }]}>
          <Typography 
            variant="caption" 
            style={[styles.tabLabel, { color: theme.colors.primary, marginLeft: 0 }]}
            numberOfLines={1}
          >
            {options.title || route.name}
          </Typography>
        </Animated.View>
      </View>
    </AnimatedTouchableOpacity>
  );
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        return (
          <TabItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={() => navigation.navigate(route.name)}
            index={index}
            total={state.routes.length}
            options={descriptors[route.key].options}
          />
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="activity" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.navBackground,
    height: 85,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.41)',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tabContainerFocused: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  tabLabel: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: 14,
  },
});
