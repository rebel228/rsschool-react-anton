import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getGames } from '../api/games';
import { GamesList } from '../components/GamesList/GamesList';
import { Header } from '../components/Header/Header';
import { Loader } from '../components/Loader/Loader';
import { Pagination } from '../components/Pagination/Pagination';
import { IGame } from '../types/types';
import { getFromLocalStorage } from '../utils/utils';
import styles from './MainPage.module.css';

const MainPage = (): React.ReactElement => {
  const [gamesList, setGamesList] = useState<IGame[]>([]);
  const [gamesCount, setGamesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState(
    getFromLocalStorage('searchString')
  );
  const [queryString, setQueryString] = useState('');
  const [isDescription, setIsDescription] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    location.pathname !== '/'
      ? setIsDescription(true)
      : setIsDescription(false);
  }, [location.pathname]);

  const getGamesList = async (
    searchString: string,
    page: number,
    itemsOnPage: number
  ): Promise<void> => {
    setIsLoading(true);
    const response = await getGames(searchString, page, itemsOnPage);
    setGamesCount(response.count);
    setGamesList(response.results);
    setIsLoading(false);
  };

  const setError = (): void => setIsError(true);

  useEffect(() => {
    const url = `?page=${currentPage}&search=${searchQuery}&page_size=${pageSize}`;
    setQueryString(url);
    navigate(url);
    getGamesList(searchQuery, currentPage, pageSize);
  }, [currentPage, searchQuery, pageSize, navigate]);

  useEffect(() => {
    if (isError) throw new Error('Error for test ErrorBoundary');
  }, [isError]);

  return (
    <div className={styles.mainPage}>
      <Header
        setCurrentPage={setCurrentPage}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
      />

      <main
        className={
          isDescription ? `${styles.main} ${styles.small}` : styles.main
        }
      >
        <button className={styles.button} type="button" onClick={setError}>
          Throw Error
        </button>
        <div className={styles.container}>
          <div className={styles.content}>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <GamesList gamesList={gamesList} queryString={queryString} />
                <Pagination
                  gamesCount={gamesCount}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setPageSize={setPageSize}
                  pageSize={pageSize}
                />
              </>
            )}
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export { MainPage };
