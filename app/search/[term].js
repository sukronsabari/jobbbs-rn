import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { ScreenHeaderBtn, NearbyJobCard } from '../../components';
import axios from 'axios';

import useFetch from '../../hooks/useFetch';
import { COLORS, SIZES, icons } from '../../constants';

import styles from '../../styles/search';
import { Image } from 'react-native';

export default function SearchResult() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchResult, setSearchResult] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        headers: {
          'X-RapidAPI-Key':
            '085cd72452mshbb4376256a41e45p1bbde3jsnb181388c6154',
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
        },
        params: { query: searchParams.term, page: page.toString() },
      };

      const response = await axios.request(options);
      setSearchResult(response.data.data);
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaginationPress = (direction) => {
    if (direction === 'left' && page > 1) {
      setPage((page) => page - 1);
      handleSearch();
    } else if (direction === 'right') {
      setPage((page) => page + 1);
      handleSearch();
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
        }}
      />
      <FlatList
        data={searchResult}
        renderItem={({ item }) => (
          <NearbyJobCard
            job={item}
            handleNavigate={() => router.push(`/job-details/${item.job_id}`)}
          />
        )}
        keyExtractor={(item) => item.job_id}
        contentContainerStyle={{ padding: SIZES.medium, rowGap: SIZES.medium }}
        ListHeaderComponent={() => (
          <>
            <View style={styles.container}>
              <Text style={styles.searchTitle}>{searchParams?.term || ''}</Text>
              <Text style={styles.noOfSearchedJobs}>Job Opportunitie</Text>
            </View>
            <View style={styles.loaderContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                isError && <Text>Opps, something went wrong!</Text>
              )}
            </View>
          </>
        )}
        ListFooterComponent={() => (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => handlePaginationPress('left')}
            >
              <Image
                source={icons.chevronLeft}
                style={styles.paginationImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.paginationTextBox}>
              <Text style={styles.paginationText}>{page}</Text>
            </View>
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={() => handlePaginationPress('right')}
            >
              <Image
                source={icons.chevronRight}
                style={styles.paginationImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      ></FlatList>
    </SafeAreaView>
  );
}
