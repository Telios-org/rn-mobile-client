import styles from '../styles';
import { Switch, Text, View } from 'react-native';
import { fonts } from '../../../util/fonts';
import { colors } from '../../../util/colors';
import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../../hooks';
import { SectionPropsType } from './SectionPropsType';
import { updateAliasFlow } from '../../../store/thunks/aliases';
import { Alias } from '../../../store/types';

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
  const [isAliasDisabled, setIsAliasDisabled] = useState(aliasDisabled);

  useEffect(() => {
    if (fireUpdate.current && isAliasDisabled !== undefined) {
      dispatch(
        updateAliasFlow({
          aliasId,
          domain,
          disabled: isAliasDisabled,
        }),
      );
    }
    fireUpdate.current = true;
  }, [isAliasDisabled]);

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
                backgroundColor: isAliasDisabled
                  ? colors.error
                  : colors.success,
              },
            ]}
          />
        </View>
      </View>
      <Switch
        value={!isAliasDisabled}
        trackColor={{
          false: colors.inkLighter,
          true: colors.primaryBase,
        }}
        onValueChange={() => setIsAliasDisabled(!isAliasDisabled)}
      />
    </View>
  );
};
