import ToRecipient from './index';
import React, { useState } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { Icon } from '../../../../components/Icon';
import { colors } from '../../../../util/colors';
import styles from './styles';

const CcHide = ({ onPress }: { onPress: () => void }) => (
  <Pressable onPress={onPress}>
    <Icon name="close-outline" size={18} color={colors.inkBase} />
  </Pressable>
);

interface ToInputOptions {
  to: string[];
  bcc: string[];
  cc: string[];
  toInputs: React.ReactNode;
}

export default (
  initialTo: string[] = [],
  initialBcc: string[] = [],
  initialCc: string[] = [],
  toInputStyle?: StyleProp<ViewStyle>,
): ToInputOptions => {
  const [to, setTo] = useState(initialTo);
  const [bcc, setBcc] = useState(initialBcc);
  const [cc, setCc] = useState(initialCc);
  const [isBccVisible, setIsBccVisible] = useState(initialBcc.length > 0);
  const [isCcVisible, setIsCcVisible] = useState(initialCc.length > 0);
  const ccButtons = (
    <View style={styles.flexDirectionRow}>
      <Pressable
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        onPress={() => setIsCcVisible(!isCcVisible)}
        style={styles.actionBtnSpacing}>
        <Text>Cc</Text>
      </Pressable>
      <Pressable
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        onPress={() => setIsBccVisible(!isBccVisible)}>
        <Text>Bcc</Text>
      </Pressable>
    </View>
  );

  return {
    to,
    bcc: isBccVisible ? bcc : [],
    cc: isCcVisible ? cc : [],
    toInputs: (
      <>
        <ToRecipient
          recipients={to}
          setRecipients={setTo}
          style={toInputStyle}
          rightComponent={ccButtons}
        />
        {isCcVisible && (
          <ToRecipient
            recipients={cc}
            setRecipients={setCc}
            style={toInputStyle}
            recipientsPrefix="Cc"
            rightComponent={<CcHide onPress={() => setIsCcVisible(false)} />}
          />
        )}
        {isBccVisible && (
          <ToRecipient
            recipients={bcc}
            setRecipients={setBcc}
            style={toInputStyle}
            recipientsPrefix="Bcc"
            rightComponent={<CcHide onPress={() => setIsBccVisible(false)} />}
          />
        )}
      </>
    ),
  };
};
