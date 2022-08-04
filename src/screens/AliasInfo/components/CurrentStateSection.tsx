import styles from '../styles';
import { Switch, Text, View } from 'react-native';
import { fonts } from '../../../util/fonts';
import { colors } from '../../../util/colors';
import React, { useEffect, useRef, useState } from 'react';
import { Alias, updateAliasFlow } from '../../../store/aliases';
import { useAppDispatch } from '../../../hooks';
import { SectionPropsType } from './SectionPropsType';

interface CurrentStateSectionProps extends SectionPropsType {
  aliasDisabled: Alias['disabled'];
}

export default ({
  aliasDisabled,
  aliasId,
  domain,
}: CurrentStateSectionProps) => {
  const dispatch = useAppDispatch();
  const fireUpdate = useRef(false);
  const [isAliasActive, setIsAliasActive] = useState(aliasDisabled);

  useEffect(() => {
    if (fireUpdate.current) {
      dispatch(
        updateAliasFlow({
          aliasId: aliasId,
          domain,
          disabled: isAliasActive || false,
        }),
      );
    }
    fireUpdate.current = true;
  }, [isAliasActive]);

  return (
    <View style={styles.statusContainer}>
      <View>
        <Text style={fonts.regular.bold}>Active</Text>
        <View style={styles.statusIndicatorContainer}>
          <Text style={styles.lighterText}>Currently Active</Text>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: isAliasActive ? colors.success : colors.error,
              },
            ]}
          />
        </View>
      </View>
      <Switch
        value={isAliasActive}
        trackColor={{
          false: colors.inkLighter,
          true: colors.primaryBase,
        }}
        onValueChange={() => setIsAliasActive(!isAliasActive)}
      />
    </View>
  );
};
