import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { Header } from '../components/Header';
import { theme } from '../constants/theme';
import { Page } from '../components/Page';

export default function ModalScreen() {
  return (
    <Page style={styles.container}>
      <Header title="Modal Info" isSubScreen={true} />
      <View style={styles.content}>
        <ThemedText type="title">This is a modal</ThemedText>
        <Link href="/" dismissTo style={styles.link}>
          <ThemedText type="link">Go to home screen</ThemedText>
        </Link>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
