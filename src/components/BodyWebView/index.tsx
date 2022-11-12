import WebView, { WebViewProps } from 'react-native-webview';
import styles from '../../screens/EmailDetails/styles';
import { Linking } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

interface BodyWebViewProps extends WebViewProps {
  bodyAsHtml: string;
  contentEditable?: boolean;
}

const injectedJavaScript = `
    document.getElementById("rootRN").addEventListener("input", function() {
      window.ReactNativeWebView.postMessage(document.documentElement.innerHTML);
     }, false);
  `;

export default ({
  bodyAsHtml,
  contentEditable,
  ...webViewProps
}: BodyWebViewProps) => {
  const navigation = useNavigation<any>();
  return (
    <WebView
      originWhitelist={['*']}
      source={{
        html: `<!DOCTYPE html>
        <meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0">
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 32px;
              color: #575757;
              line-height: 1.5;
            }
          </style>
        </head>
        <html id="rootRN" lang="en"><body contenteditable="${contentEditable}">${bodyAsHtml}</body></html>`,
      }}
      scalesPageToFit
      injectedJavaScript={injectedJavaScript}
      style={[styles.bodyContainer]}
      showsVerticalScrollIndicator={false}
      onShouldStartLoadWithRequest={request => {
        if (request.url !== 'about:blank') {
          if (request.url.startsWith('mailto:')) {
            navigation.navigate('compose', {
              to: [request.url.replace('mailto:', '')],
            });
          } else {
            Linking.openURL(request.url);
          }
          return false;
        } else {
          return true;
        }
      }}
      {...webViewProps}
    />
  );
};
