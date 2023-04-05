import { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { images, icons, COLORS, FONT, SIZES, SHADOWS } from '../constants';
import {
  Nearbyjobs,
  Popularjobs,
  ScreenHeaderBtn,
  Welcome,
} from '../components';

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={images.profile} dimension="100%" />
          ),
          headerTitle: '',
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: SIZES.medium }}>
          <Welcome
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleClick={() => {
              if (searchTerm) router.push(`/search/${searchTerm}`);
            }}
          />

          <Popularjobs />

          <Nearbyjobs />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
