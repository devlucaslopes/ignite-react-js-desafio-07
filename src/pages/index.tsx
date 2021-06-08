import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { AxiosResponse } from 'axios';
import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

export default function Home(): JSX.Element {
  const fetchImages = ({ pageParam = 0 }): any =>
    api(`/images?after=${pageParam}`).then(({ data }) => data);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.after,
  });

  const formattedData = useMemo(() => {
    const formated = [];

    data?.pages.map(dataImage => formated.push(...dataImage.data));

    return formated;
  }, [data]);

  if (isLoading) {
    <Loading />;
  }

  if (isError) {
    <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button onClick={() => fetchNextPage}>
            {isFetchingNextPage ? 'Carregando aplicação...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
