import { useState, useCallback } from 'react';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Stack, useRouter, useSearchParams } from 'expo-router';

import {
  Company,
  JobAbout,
  JobFooter,
  Specifics,
  JobTabs,
  ScreenHeaderBtn,
} from '../../components';
import { COLORS, SIZES, icons } from '../../constants';
import useFetch from '../../hooks/useFetch';

const tabs = ['About', 'Qualifications', 'Responsibilities'];

export default function JobDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const { data, error, isLoading, refetch } = useFetch({
    endpoint: 'job-details',
    params: { job_id: searchParams.id, extended_publisher_details: 'false' },
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  const displayTabContent = () => {
    switch (activeTab) {
      case 'Qualifications':
        return (
          <Specifics
            title="Qualifications"
            points={data[0].job_highlights?.Qualifications ?? ['N/A']}
          />
        );
      case 'About':
        return (
          <JobAbout info={data[0].job_description ?? 'No data provided'} />
        );
      case 'Responsibilities':
        return (
          <Specifics
            title="Responsibilities"
            points={data[0].job_highlights?.Responsibilities ?? ['N/A']}
          />
        );
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              handlePress={() => router.back()}
              dimension="60%"
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" />
          ),
        }}
      />

      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Ups Something went wrong!</Text>
          ) : data.length === 0 ? (
            <Text>No Data</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                componyLogo={data[0].employer_logo}
                companyName={data[0].employer_name}
                jobTitle={data[0].job_title}
                location={data[0].job_country}
              />

              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}
            </View>
          )}
        </ScrollView>

        <JobFooter
          url={
            data[0]?.job_google_link ??
            'https://careers.goggle.com/jobs/results'
          }
        />
      </>
    </SafeAreaView>
  );
}
