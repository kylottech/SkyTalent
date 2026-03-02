import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, RefreshControl, FlatList, ActivityIndicator, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { QueryClient, QueryClientProvider, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';

import { useUser } from '../../context/useUser';
import Top from '../../components/Utils/Top';
import Loader from '../../components/Utils/Loader';
import Error from '../../components/Utils/Error';

// Services: base (usuarios)
import {
  topLesser, listLesser, positionLesser,
  topGreater, listGreater, positionGreater,
  topCompetition, listCompetition, positionCompetition,
  // Nuevas categorías:
  topExperiencesLesser, listExperiencesLesser, positionExperiencesLesser,
  topExperiencesGreater, listExperiencesGreater, positionExperiencesGreater,
  topExperiencesCompetition, listExperiencesCompetition, positionExperiencesCompetition,

  topListsLesser, listListsLesser, positionListsLesser,
  topListsGreater, listListsGreater, positionListsGreater,
  topListsCompetition, listListsCompetition, positionListsCompetition,

  topAlbumLesser, listAlbumLesser, positionAlbumLesser,
  topAlbumGreater, listAlbumGreater, positionAlbumGreater,
  topAlbumCompetition, listAlbumCompetition, positionAlbumCompetition,
} from '../../services/rankingServices';

// ---------- CONFIG (categoría -> segmento -> servicios) ----------
const CATEGORY_KEYS = ['users', 'experiences', 'lists', 'album'];
const MODE_KEYS = ['lesser', 'greater', 'competition'];

const SERVICES = {
  users: {
    lesser: { top: topLesser, list: listLesser, position: positionLesser },
    greater: { top: topGreater, list: listGreater, position: positionGreater },
    competition: { top: topCompetition, list: listCompetition, position: positionCompetition },
  },
  experiences: {
    lesser: { top: topExperiencesLesser, list: listExperiencesLesser, position: positionExperiencesLesser },
    greater: { top: topExperiencesGreater, list: listExperiencesGreater, position: positionExperiencesGreater },
    competition: { top: topExperiencesCompetition, list: listExperiencesCompetition, position: positionExperiencesCompetition },
  },
  lists: {
    lesser: { top: topListsLesser, list: listListsLesser, position: positionListsLesser },
    greater: { top: topListsGreater, list: listListsGreater, position: positionListsGreater },
    competition: { top: topListsCompetition, list: listListsCompetition, position: positionListsCompetition },
  },
  album: {
    lesser: { top: topAlbumLesser, list: listAlbumLesser, position: positionAlbumLesser },
    greater: { top: topAlbumGreater, list: listAlbumGreater, position: positionAlbumGreater },
    competition: { top: topAlbumCompetition, list: listAlbumCompetition, position: positionAlbumCompetition },
  },
};

// ---------- HOOKS DE DATOS ----------
function useTop(catKey, modeKey, logout) {
  const svc = SERVICES[catKey][modeKey];
  return useQuery({
    queryKey: ['ranking', catKey, modeKey, 'top'],
    queryFn: () => svc.top(logout),
    staleTime: 1000 * 60 * 5,
  });
}

function usePosition(catKey, modeKey, logout) {
  const svc = SERVICES[catKey][modeKey];
  return useQuery({
    queryKey: ['ranking', catKey, modeKey, 'position'],
    queryFn: () => svc.position(logout),
    staleTime: 1000 * 60 * 5,
  });
}

function useList(catKey, modeKey, logout, pageSize = 20) {
  const svc = SERVICES[catKey][modeKey];
  return useInfiniteQuery({
    queryKey: ['ranking', catKey, modeKey, 'list', pageSize],
    queryFn: ({ pageParam }) => svc.list(logout, { cursor: pageParam, limit: pageSize }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
  });
}

// ---------- HELPERS DE TEXTOS ----------
const fmt = (tpl, v1) => (tpl || '').replace('{{variable1}}', String(v1));

function getCategoryLabel(screenTexts, catKey) {
  // Primer menú: Label1..4 en el orden de CATEGORY_KEYS
  const labelsByIndex = [screenTexts.Label1, screenTexts.Label2, screenTexts.Label3, screenTexts.Label4];
  const idx = CATEGORY_KEYS.indexOf(catKey);
  return labelsByIndex[idx] ?? '';
}

function getCategoryEmoji(catKey) {
  // Emojis representativos para cada categoría
  switch (catKey) {
    case 'users': return '👥';
    case 'experiences': return '🎯';
    case 'lists': return '📋';
    case 'album': return '📸';
    default: return '⭐';
  }
}

// Función para navegar al perfil del usuario
function navigateToProfile(navigate, userId) {
  if (userId) {
    navigate.navigate('OtroPerfil', { userId });
  }
}

function getRightCardTitle(screenTexts, catKey) {
  // Texto a la derecha en la tarjeta (varía por categoría)
  switch (catKey) {
    case 'users': return screenTexts.Kylets;
    case 'experiences': return screenTexts.ExperienceKylets;
    case 'lists': return screenTexts.ListsKylets;
    case 'album': return screenTexts.AlbumKylets;
    default: return '';
  }
}

function getPointsTemplate(screenTexts, catKey) {
  // Plantilla para "{variable1} ..." (varía por categoría)
  switch (catKey) {
    case 'users': return screenTexts.KyletsPoints;
    case 'experiences': return screenTexts.ExperiencePoints;
    case 'lists': return screenTexts.ListsPoints;
    case 'album': return screenTexts.AlbumPoints;
    default: return '';
  }
}

// ---------- UI ----------
const queryClient = new QueryClient();

export default function RankingScreen() {
  return (
    <QueryClientProvider client={queryClient}>
      <RankingScreenInner />
    </QueryClientProvider>
  );
}

function RankingScreenInner() {
  const navigate = useNavigation();
  const { logout, texts } = useUser();
  const screenTexts = texts.pages.Ranking.RankingScreen;

  // Estado: categoría y segmento
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [modeIndex, setModeIndex] = useState(0);

  // Animaciones
  const categoryAnimations = useRef(
    CATEGORY_KEYS.map(() => new Animated.Value(0))
  ).current;
  const segmentAnimations = useRef(
    MODE_KEYS.map(() => new Animated.Value(0))
  ).current;

  const catKey = CATEGORY_KEYS[categoryIndex];
  const modeKey = MODE_KEYS[modeIndex];

  const { data: topData, isLoading: topLoading, error: topError } = useTop(catKey, modeKey, logout);
  const { data: posData, isLoading: posLoading, error: posError } = usePosition(catKey, modeKey, logout);
  const {
    data: listPages,
    isLoading: listLoading,
    isFetchingNextPage,
    fetchNextPage,
    error: listError,
  } = useList(catKey, modeKey, logout, 20);

  const query = useQueryClient();

  const list = useMemo(
    () => (listPages?.pages ? listPages.pages.flatMap((p) => p.items ?? []) : []),
    [listPages]
  );

  const top = topData ?? [];
  
  // Lista desde posición 4 + usuario integrado si no está en top
  const listWithUser = useMemo(() => {
    let listWithPosition = list.map((player, index) => ({
      ...player,
      position: index + 4, // Empieza desde posición 4
    }));
    
    // Agregar usuario actual si no está en el top 3 y tenemos datos de posición
    if (posData && posData.position > 3) {
      const userEntry = {
        id: 'current-user',
        name: 'You', // O el nombre real del usuario si está disponible
        surname: '',
        kylotId: posData.kylotId || 'Your ID',
        generate: posData.kylets || 0,
        position: posData.position,
        avatar: posData.avatar || { url: 'https://via.placeholder.com/50x50/cccccc/666666?text=U' },
        isCurrentUser: true,
      };
      
      // Insertar en la posición correcta o al final si es muy alta
      if (posData.position <= listWithPosition.length + 3) {
        listWithPosition.splice(posData.position - 4, 0, userEntry);
      } else {
        listWithPosition.push(userEntry);
      }
    }
    
    return listWithPosition;
  }, [list, posData]);

  const maxScore = useMemo(() => (top.length ? Math.max(...top.map((u) => u?.generate || 0)) : 150), [top]);
  const minScore = useMemo(() => (top.length ? Math.min(...top.map((u) => u?.generate || 0)) : 130), [top]);

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage) fetchNextPage();
  }, [isFetchingNextPage, fetchNextPage]);

  const onRefresh = useCallback(() => {
    query.invalidateQueries({ queryKey: ['ranking', catKey, modeKey] });
  }, [query, catKey, modeKey]);

  const anyError = topError || posError || listError;

  // Efectos de animación
  useEffect(() => {
    // Animar categoría seleccionada
    categoryAnimations.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: index === categoryIndex ? 1 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    });
  }, [categoryIndex]);

  useEffect(() => {
    // Animar segmento seleccionado
    segmentAnimations.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: index === modeIndex ? 1 : 0,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }).start();
    });
  }, [modeIndex]);

  const Header = (
    <View>
      {/* Banner de Ranking - Arriba del todo */}
      {posData ? (
        <ExpoLinearGradient
          colors={['#021b79', '#0575e6']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.gradientContainer}
        >
          <Text style={styles.title}>{screenTexts.Title}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'column', marginRight: 50 }}>
              <Text style={styles.inviteCount}>{screenTexts.Position}</Text>
              <Text style={styles.inviteCount2}>{posData.position}</Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.inviteCount}>{getRightCardTitle(screenTexts, catKey)}</Text>
              <Text style={styles.inviteCount2}>{posData.kylets}</Text>
            </View>
          </View>
        </ExpoLinearGradient>
      ) : null}

      {/* Selector de CATEGORÍA - Diseño Moderno */}
      <View style={styles.categoriasContainer}>
        <View style={styles.categorias}>
          {CATEGORY_KEYS.map((key, idx) => {
            const isSelected = categoryIndex === idx;
            const animatedScale = categoryAnimations[idx].interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.05],
            });
            const animatedOpacity = categoryAnimations[idx].interpolate({
              inputRange: [0, 1],
              outputRange: [0.7, 1],
            });
            
            return (
              <Pressable
                key={key}
                onPress={() => {
                  setCategoryIndex(idx);
                }}
                style={styles.categoriaBtn}
              >
                <Animated.View 
                  style={[
                    styles.categoriaContent,
                    isSelected && styles.categoriaContentSelected,
                    {
                      transform: [{ scale: animatedScale }],
                      opacity: animatedOpacity,
                    }
                  ]}
                >
                  <View style={[
                    styles.categoriaIcon,
                    isSelected && styles.categoriaIconSelected
                  ]}>
                    <Text style={[
                      styles.categoriaEmoji,
                      isSelected && styles.categoriaEmojiSelected
                    ]}>
                      {getCategoryEmoji(key)}
                    </Text>
                  </View>
                  <Text style={[
                    styles.categoriaText,
                    isSelected && styles.categoriaTextSelected
                  ]}>
                    {getCategoryLabel(screenTexts, key)}
                  </Text>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Tabs de SEGMENTO - Diseño Moderno */}
      <View style={styles.segmentContainer}>
        <View style={styles.segmentTabs}>
          {MODE_KEYS.map((key, idx) => {
            const isSelected = modeIndex === idx;
            const animatedScale = segmentAnimations[idx].interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.02],
            });
            
            return (
              <Pressable
                key={key}
                onPress={() => setModeIndex(idx)}
                style={styles.segmentTab}
              >
                <Animated.View 
                  style={[
                    styles.segmentTabContent,
                    isSelected && styles.segmentTabSelected,
                    {
                      transform: [{ scale: animatedScale }],
                    }
                  ]}
                >
                  <Text style={[
                    styles.segmentText,
                    isSelected && styles.segmentTextSelected
                  ]}>
                    {key === 'competition' ? screenTexts.Option : (key === 'lesser' ? '≤ 30' : '> 30')}
                  </Text>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Top 3 */}
      <View style={styles.rankingContainer}>
        {topLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0575e6" />
            <Text style={styles.loadingText}>Cargando podio...</Text>
          </View>
        ) : top.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyText}>No hay datos del podio disponibles</Text>
          </View>
        ) : (
          <>
            {top.map((player, index) => {
              const validMinScore = isNaN(minScore) ? 130 : minScore;
              const validMaxScore = isNaN(maxScore) ? 150 : maxScore;
              const playerScore = player?.generate || 0;
              const height =
                validMaxScore === validMinScore
                  ? 100
                  : ((playerScore - validMinScore) / (validMaxScore - validMinScore)) * 100 + 50;
              const rankColor = player?.menor ? '#ffffff' : '#ffffff';
              const avatarUrl = player?.avatar?.url || 'https://via.placeholder.com/60x60/cccccc/666666?text=U';
              const playerName = `${player?.name || ''} ${player?.surname || ''}`.trim();
              const playerPosition = player?.position || (index + 1);
              return (
                <Pressable 
                  key={index} 
                  style={({ pressed }) => [
                    styles.playerContainer, 
                    { marginTop: 30 * (playerPosition - 1) },
                    pressed && styles.pressedPlayer
                  ]}
                  onPress={() => {
                    navigateToProfile(navigate, player?._id);
                  }}
                >
                  <Image source={{ uri: avatarUrl }} style={styles.profileImage} />
                  <Text style={styles.playerName}>{playerName}</Text>
                  <LinearGradient
                    colors={['#1D7CE4', '#004999']}
                    start={[0.5, 0]}
                    end={[0.5, 1]}
                    style={[styles.bar, { height }]}
                  >
                    <Text style={[styles.rankNumber, { color: rankColor }]}>{playerPosition}</Text>
                  </LinearGradient>
                  {/* Puntos con corona */}
                  <View style={styles.pointsContainer}>
                    <Image source={require('../../../assets/CORONA_DORADA.png')} style={styles.crownIcon} />
                    <Text style={styles.score}>{playerScore}</Text>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}
      </View>

      <Text style={styles.podio2}>{screenTexts.OtherPosition}</Text>
    </View>
  );

  if (anyError) {
    return (
      <View style={styles.container}>
        <Top left={true} leftType={'Back'} typeCenter={'Text'} textCenter={screenTexts.Top} />
        <Error message={(topError || posError || listError)?.message || 'Error'} func={() => {}} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Top left={true} leftType={'Back'} typeCenter={'Text'} textCenter={screenTexts.Top} />

      <FlatList
        data={listWithUser}
        keyExtractor={(item, index) => `${catKey}-${modeKey}-${item?.id ?? item?.kylotId ?? index}`}
        ListHeaderComponent={Header}
        renderItem={({ item, index }) => {
          const avatarUrl = item?.avatar?.url || 'https://via.placeholder.com/50x50/cccccc/666666?text=U';
          const generate = item?.generate || 0;
          const position = item?.position || (index + 4);
          
          // Colores para ranking - verde para top 3, gris para resto
          const getRankColor = (pos) => {
            if (pos <= 3) return '#00C851'; // Verde para top 3
            return '#9d9d9d'; // Gris para resto
          };
          
          return (
            <Pressable 
              style={({ pressed }) => [
                styles.listItem, 
                item?.isCurrentUser && styles.currentUserItem,
                pressed && styles.pressedItem
              ]}
              onPress={() => {
                navigateToProfile(navigate, item?._id);
              }}
            >
              <Text style={[styles.rankNumber, { color: getRankColor(position) }]}>
                {position}
              </Text>
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, item?.isCurrentUser && styles.currentUserName]}>
                  {item?.isCurrentUser ? 'You' : `${item?.name || ''} ${item?.surname || ''}`.trim()}
                </Text>
                <Text style={styles.userId}>{item?.kylotId || 'N/A'}</Text>
              </View>
              <View style={styles.pointsContainer}>
                <Image source={require('../../../assets/CORONA_DORADA.png')} style={styles.crownIcon} />
                <Text style={styles.pointsText}>{generate}</Text>
              </View>
            </Pressable>
          );
        }}
        refreshControl={<RefreshControl refreshing={listLoading} onRefresh={onRefresh} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#0575e6" />
              <Text style={styles.loadingMoreText}>Cargando más...</Text>
            </View>
          ) : listWithUser.length === 0 && !listLoading ? (
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListEmoji}>📊</Text>
              <Text style={styles.emptyListText}>No hay más posiciones para mostrar</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

// ---- estilos ----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { width: '100%', alignItems: 'center', paddingBottom: 24 },

  // Selector de categorías - Diseño Minimalista
  categoriasContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
  },
  categorias: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoriaBtn: {
    flex: 1,
  },
  categoriaContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
    backgroundColor: 'transparent',
    minHeight: 40,
  },
  categoriaContentSelected: {
    backgroundColor: '#0575e6',
  },
  categoriaIcon: {
    marginBottom: 4,
  },
  categoriaIconSelected: {
    // Sin cambios especiales
  },
  categoriaEmoji: {
    fontSize: 14,
  },
  categoriaEmojiSelected: {
    fontSize: 14,
  },
  categoriaText: { 
    color: '#666666', 
    fontWeight: '500',
    fontSize: 11,
    textAlign: 'center',
  },
  categoriaTextSelected: { 
    color: '#ffffff', 
    fontWeight: '600',
    fontSize: 11,
  },

  // Tabs de segmento - Diseño Moderno
  segmentContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  segmentTabs: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentTab: {
    flex: 1,
    marginHorizontal: 2,
  },
  segmentTabContent: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  segmentTabSelected: {
    backgroundColor: '#0575e6',
    shadowColor: '#0575e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    color: '#6c757d',
    fontWeight: '600',
    fontSize: 14,
  },
  segmentTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  gradientContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '95%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  inviteCount: { color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 10 },
  inviteCount2: { color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginTop: 5 },
  podio2: { fontSize: 20, alignSelf: 'flex-start', marginHorizontal: 16, fontWeight: 'bold', marginTop: 20 },

  rankingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    height: 300,
    paddingHorizontal: 25,
    marginTop: 20,
  },
  playerContainer: { alignItems: 'center', width: '30%' },
  profileImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 10 },
  playerName: { color: 'black', fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  bar: {
    width: '85%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    minHeight: 100,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  rankNumber: { 
    fontSize: 58, 
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    alignSelf: 'center',
  },
  score: { color: 'black', fontWeight: 'bold', marginTop: 5 },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  crownIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },

  // Lista simple (desde posición 4)
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    width: '100%',
    justifyContent: 'space-between',
  },
  currentUserItem: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 3,
    borderLeftColor: '#0575e6',
  },
  rankNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 45,
    textAlign: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  currentUserName: {
    color: '#0575e6',
  },
  userId: {
    fontSize: 13,
    color: '#666',
  },
  pointsText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },

  // Mejoras de UX
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyListContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyListEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptyListText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  pressedItem: {
    backgroundColor: '#f0f0f0',
    transform: [{ scale: 0.98 }],
  },
  pressedPlayer: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});
