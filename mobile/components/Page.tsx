import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { Header, HEADER_HEIGHT, HEADER_MIN_TOP, HEADER_VERTICAL_GAP } from './Header';

interface PageProps {
  children?: React.ReactNode;
  scroll?: boolean;
  contentContainerStyle?: object;
  style?: object;
}

// Approximate bottom nav footprint: height + outer margin
const BOTTOM_NAV_HEIGHT = 60;
const BOTTOM_NAV_MARGIN = 16;

export const Page: React.FC<PageProps> = ({ children, scroll = false, contentContainerStyle, style }) => {
  const insets = useSafeAreaInsets();
  const paddingHorizontal = theme.spacing.md; // 16 to match header/nav
  const paddingBottom = insets.bottom + BOTTOM_NAV_HEIGHT + BOTTOM_NAV_MARGIN;
  const childList = React.Children.toArray(children);
  const firstChild = childList[0];
  const hasHeader = React.isValidElement(firstChild) && firstChild.type === Header;
  const contentChildren = hasHeader ? childList.slice(1) : childList;
  const headerTopOffset = Math.max(insets.top, HEADER_MIN_TOP) + HEADER_VERTICAL_GAP;
  const headerSlotHeight = hasHeader ? headerTopOffset + HEADER_HEIGHT : 0;
  const topPadding = hasHeader ? headerSlotHeight + theme.spacing.sm : 10;

  if (scroll) {
    return (
      <View style={[styles.shell, style]}>
        {hasHeader ? (
          <View style={[styles.headerSlot, { height: headerSlotHeight }]} pointerEvents="box-none">
            {firstChild}
          </View>
        ) : null}
        <ScrollView
          contentContainerStyle={[
            { flexGrow: 1, paddingHorizontal, paddingTop: topPadding, paddingBottom },
            contentContainerStyle,
          ]}
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {contentChildren}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.shell, style]}>
      {hasHeader ? (
        <View style={[styles.headerSlot, { height: headerSlotHeight }]} pointerEvents="box-none">
          {firstChild}
        </View>
      ) : null}
      <View
        style={[
          {
            flex: 1,
            paddingHorizontal,
            paddingTop: topPadding,
            paddingBottom,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        {contentChildren}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  headerSlot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    zIndex: 100,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
});

export default Page;
