import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { Page } from '../../components/Page';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { getCurrentUser, updateCurrentUser } from '../../lib/api';

const DEFAULT_AVATAR = require('../../assets/images/user.png');

type SelectedImage = {
  uri: string;
  name: string;
  type: string;
};

export default function EditProfileScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const [name, setName] = useState('Ahmed Khan');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+92 300 1234567');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token || !userId) return;

    void getCurrentUser({ token, userId })
      .then((user: any) => {
        setName(user?.name || 'Ahmed Khan');
        setEmail(typeof user?.email === 'string' ? user.email.trim() : '');
        setPhoneNumber(user?.phoneNumber || '+92 300 1234567');
        setAddress(typeof user?.address === 'string' ? user.address.trim() : '');
        setProfileImage(typeof user?.profileImage === 'string' && user.profileImage.trim() ? user.profileImage.trim() : null);
        setSelectedImage(null);
      })
      .catch(() => {});
  }, [token, userId]);

  const handlePickImage = async () => {
    let ImagePickerModule: typeof import('expo-image-picker');

    try {
      ImagePickerModule = await import('expo-image-picker');
    } catch {
      Alert.alert('Photo picker unavailable', 'Please rebuild the app so the image picker native module is included.');
      return;
    }

    const permission = await ImagePickerModule.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos to choose a profile image.');
      return;
    }

    const result = await ImagePickerModule.launchImageLibraryAsync({
      mediaTypes: ImagePickerModule.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    const fileName = asset.fileName || `profile-${Date.now()}.jpg`;
    const mimeType = asset.mimeType || 'image/jpeg';

    setProfileImage(asset.uri);
    setSelectedImage({
      uri: asset.uri,
      name: fileName,
      type: mimeType,
    });
  };

  const handleSave = async () => {
    if (!token || !userId) {
      Alert.alert('Sign in required', 'Please sign in before updating your profile.');
      return;
    }

    setSaving(true);

    try {
      if (selectedImage) {
        const formData = new FormData();

        formData.append('name', name.trim());
        if (email.trim()) formData.append('email', email.trim());
        formData.append('phoneNumber', phoneNumber.trim());
        if (address.trim()) formData.append('address', address.trim());
        formData.append('profileImage', {
          uri: selectedImage.uri,
          name: selectedImage.name,
          type: selectedImage.type,
        } as unknown as Blob);

        await updateCurrentUser(userId, formData, { token, userId });
      } else {
        await updateCurrentUser(
          userId,
          {
            name: name.trim(),
            email: email.trim() || undefined,
            phoneNumber: phoneNumber.trim(),
            address: address.trim() || undefined,
          },
          { token, userId },
        );
      }

      Alert.alert('Profile updated', 'Your changes were saved successfully.');
      router.back();
    } catch (error) {
      Alert.alert('Unable to save', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page scroll style={styles.container}>
      <Header title="Edit Profile" isSubScreen onBackPress={() => router.back()} />

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Image
              source={profileImage ? { uri: profileImage } : DEFAULT_AVATAR}
              style={styles.avatar}
              contentFit="cover"
            />
            <TouchableOpacity style={styles.cameraBubble} activeOpacity={0.85} onPress={handlePickImage}>
              <MaterialIcons name="photo-camera" size={24} color="#8A5A00" />
            </TouchableOpacity>
          </View>

          <Typography variant="h3" weight="bold" align="center" style={styles.title}>
            Change Profile Photo
          </Typography>
        </View>

        <LabeledField label="Full Name" value={name} onChangeText={setName} />

        <LabeledField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email address"
          icon={<MaterialIcons name="mail-outline" size={28} color="#6B7280" />}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <LabeledField
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number"
          icon={<MaterialIcons name="phone" size={28} color="#6B7280" />}
          keyboardType="phone-pad"
        />

        <LabeledField
          label="Primary Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Enter primary address"
          icon={<MaterialIcons name="location-on" size={28} color="#6B7280" />}
          multiline
          inputStyle={styles.addressInput}
        />

        <Button title="Save Changes" onPress={handleSave} loading={saving} style={styles.saveButton} />
      </View>
    </Page>
  );
}

function LabeledField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  multiline = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  inputStyle,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  multiline?: boolean;
  keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
  autoCapitalize?: React.ComponentProps<typeof TextInput>['autoCapitalize'];
  inputStyle?: object;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Typography variant="h3" weight="bold" style={styles.fieldLabel}>
        {label}
      </Typography>

      <View style={[styles.fieldCard, multiline && styles.fieldCardMultiline]}>
        {icon ? <View style={styles.fieldIcon}>{icon}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          style={[
            styles.input,
            icon ? styles.inputWithIcon : null,
            multiline ? styles.multilineInput : null,
            inputStyle,
          ]}
          placeholderTextColor="#94A3B8"
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    gap: 24,
    paddingBottom: theme.spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
  },
  avatarWrap: {
    width: 166,
    height: 166,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cameraBubble: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    color: '#52525B',
    fontSize: 22,
  },
  fieldGroup: {
    gap: 12,
  },
  fieldLabel: {
    color: theme.colors.textPrimary,
    fontSize: 20,
  },
  fieldCard: {
    minHeight: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8E2EE',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  fieldCardMultiline: {
    minHeight: 96,
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  fieldIcon: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 18,
    paddingVertical: 0,
  },
  inputWithIcon: {
    fontSize: 17,
  },
  multilineInput: {
    minHeight: 64,
    lineHeight: 23,
    paddingTop: 2,
    textAlignVertical: 'top',
  },
  addressInput: {
    paddingRight: 4,
  },
  saveButton: {
    marginTop: 8,
    minHeight: 60,
    borderRadius: 34,
  },
});
