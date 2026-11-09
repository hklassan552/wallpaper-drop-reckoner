import React, { memo, useCallback } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import theme from '../constants/theme';
import { ROLL_PRESETS, TRIM_STEPS } from '../constants/config';
import type { Settings } from '../game/dropEngine';
import ChipRow from './ChipRow';
import PrimaryButton from './PrimaryButton';
import SectionRule from './SectionRule';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  visible: boolean;
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onClose: () => void;
};

const UNIT_ITEMS = [
  { key: 'metric', label: 'METRIC' },
  { key: 'imperial', label: 'IMPERIAL' },
];

const PRESET_ITEMS = ROLL_PRESETS.map(p => ({ key: p.key, label: p.label }));

const TRIM_ITEMS = TRIM_STEPS.map(t => ({
  key: String(t),
  label: `${Math.round(t * 1000)} MM`,
}));

/** Decor Settings — a modal sheet over the Menu, not a routed screen. */
function SettingsSheetBase({ visible, settings, onChange, onClose }: Props) {
  const setUnit = useCallback(
    (key: string) => onChange({ unit: key === 'imperial' ? 'imperial' : 'metric' }),
    [onChange],
  );
  const setTrim = useCallback(
    (key: string) => onChange({ trimAllowance: parseFloat(key) }),
    [onChange],
  );
  const setPreset = useCallback((key: string) => onChange({ preset: key }), [onChange]);
  const toggleSpare = useCallback(
    () => onChange({ spareRoll: !settings.spareRoll }),
    [onChange, settings.spareRoll],
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable
          style={styles.backdropTap}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="close settings"
        />
        <View style={styles.sheet}>
          <Text style={styles.title}>DECOR SETTINGS</Text>
          <SectionRule />

          <Text style={styles.rowLabel}>UNITS</Text>
          <ChipRow items={UNIT_ITEMS} value={settings.unit} onChange={setUnit} />

          <Text style={styles.rowLabel}>TRIM ALLOWANCE</Text>
          <ChipRow
            items={TRIM_ITEMS}
            value={String(settings.trimAllowance)}
            onChange={setTrim}
          />

          <Text style={styles.rowLabel}>ROLL PRESET</Text>
          <ChipRow items={PRESET_ITEMS} value={settings.preset} onChange={setPreset} />

          <Pressable
            style={styles.toggle}
            hitSlop={HIT}
            onPress={toggleSpare}
            accessibilityRole="switch"
            accessibilityState={{ checked: settings.spareRoll }}
            accessibilityLabel="spare roll">
            <View
              style={[styles.box, settings.spareRoll ? styles.boxOn : null]}>
              {settings.spareRoll ? (
                <Check size={16} color={theme.colors.onPrimary} strokeWidth={2} />
              ) : null}
            </View>
            <View style={styles.toggleText}>
              <Text style={styles.toggleTitle}>ADD A SPARE ROLL</Text>
              <Text style={styles.toggleHint}>ON ROOMS OF TEN DROPS OR MORE</Text>
            </View>
          </Pressable>

          <View style={styles.footer}>
            <PrimaryButton label="DONE" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(44,30,41,0.45)', justifyContent: 'flex-end' },
  backdropTap: { flex: 1, width: '100%' },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    paddingBottom: 28,
  },
  title: {
    fontFamily: theme.typography.section.fontFamily,
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: 1,
    marginBottom: 12,
  },
  rowLabel: {
    ...theme.typography.micro,
    color: theme.colors.textMuted,
    marginTop: 16,
    marginBottom: 8,
  },
  toggle: {
    width: '100%',
    height: 56,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  box: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(125,60,111,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  toggleText: { flex: 1 },
  toggleTitle: {
    fontFamily: theme.typography.value.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.8,
  },
  toggleHint: {
    ...theme.typography.micro,
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 3,
  },
  footer: { marginTop: 18 },
});

export const SettingsSheet = memo(SettingsSheetBase);
export default SettingsSheet;
