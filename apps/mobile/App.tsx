import { useRef, useState, useEffect } from 'react';
import { BackHandler, SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewRef } from 'react-native-webview';

const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? 'http://localhost:5173';

export default function App() {
  const webViewRef = useRef<WebViewRef>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F2EDE4" />
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_URL }}
        style={styles.webview}
        onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2EDE4',
  },
  webview: {
    flex: 1,
  },
});
