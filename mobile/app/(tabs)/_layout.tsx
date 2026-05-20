import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  }, [isFocused, flex, labelOpacity, labelWidth]);

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
      style={[styles.tabItem, animatedStyle]}
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
            style={[styles.tabLabel, { color: theme.colors.primary }]}
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
  const insets = useSafeAreaInsets();
  const ALLOWED = ['index', 'activity', 'profile', 'more'];
  const activeRouteName = state.routes[state.index]?.name ?? '';

  const isRouteFocused = (routeName: string) => {
    if (activeRouteName === routeName) {
      return true;
    }

    return activeRouteName.startsWith(`${routeName}/`);
  };

  return (
    <View style={[styles.tabBarContainer, { bottom: Math.max(16, insets.bottom) }]}>
      {state.routes
        .filter((r: any) => ALLOWED.includes(r.name))
        .map((route: any, index: number) => {
          // compute focused by comparing route index within filtered list
          const visibleRoutes = state.routes.filter((r: any) => ALLOWED.includes(r.name));
          const visibleIndex = visibleRoutes.findIndex((r: any) => r.key === route.key);
          const isFocused = isRouteFocused(route.name);
          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={() => navigation.navigate(route.name)}
              index={visibleIndex}
              total={visibleRoutes.length}
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
    height: 60,
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  tabItem: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tabContainerFocused: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 14,
  },
  tabLabel: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: 14,
  },
});
