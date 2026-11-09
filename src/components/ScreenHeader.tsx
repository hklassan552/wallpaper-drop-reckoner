import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

export type IconCmp = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type IconButtonProps = {
  Icon: IconCmp;
  onPress: () => void;
  color?: string;
  label: string;
};

/** 44x44 header tap target - explicit width AND height (ui-pressable). */
function HeaderIconButtonBase({
  Icon,
  onPress,
  color = theme.colors.primary,
  label,
}: IconButtonProps) {
  return (
    <Pressable
      style={styles.iconButton}
      hitSlop={HIT}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{ color: 'rgba(125,60,111,0.16)', borderless: true }}>
      <Icon size={24} color={color} strokeWidth={1.5} />
    </Pressable>
  );
}

export const HeaderIconButton = memo(HeaderIconButtonBase);

type Props = {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tinted?: boolean;
};

/** One header for every screen (Menu / Game / Order / Report) - no inline drift. */
function ScreenHeaderBase({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  tinted = true,
}: Props) {
  return (
    <View style={[styles.header, tinted ? styles.headerTinted : null]}>
      <View style={styles.side}>{leftSlot}</View>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 44,
    minHeight: 116,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTinted: {
    backgroundColor: 'rgba(125,60,111,0.07)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
  },
  side: { width: 86, justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontFamily: theme.typography.section.fontFamily,
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: 0.3,
  },
  subtitle: {
    ...theme.typography.micro,
    color: theme.colors.textMuted,
    marginTop: 3,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const ScreenHeader = memo(ScreenHeaderBase);
export default ScreenHeader;
