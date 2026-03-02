import React, {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from "react-native";

import {
  getTopCreator,
  getMyPhotos,
  getAllPhotos,
  getReviews,
  getTopCreatorByCategory
} from "../../services/mapsService";

import { useUser } from "../../context/useUser";
import { formatString } from '../../utils/formatString'
import fullStar from "../../../assets/full_star.png";

const { width } = Dimensions.get("window");
const CARD_W = Math.min(260, width * 0.7);
const CARD_H = 340;

const SocialInfo = forwardRef(
  ({ placeId, onOpenCreator, onOpenPhoto, onOpenReview, name, categoria, refreshKey }, ref) => {
    const { texts } = useUser();
    const screenTexts = texts.components.Maps.SocialInfo;

    // ===== Datos / cursores / loads =====
    const [tcData, setTcData] = useState([]); const [tcCursor, setTcCursor] = useState(null);
    const [tcLoading, setTcLoading] = useState(false); const [tcTotal, setTcTotal] = useState(null);

    // Top Creadores por Categoría
    const [tccData, setTccData] = useState([]); const [tccCursor, setTccCursor] = useState(null);
    const [tccLoading, setTccLoading] = useState(false); const [tccTotal, setTccTotal] = useState(null);

    const [mpData, setMpData] = useState([]); const [mpCursor, setMpCursor] = useState(null);
    const [mpLoading, setMpLoading] = useState(false); const [mpTotal, setMpTotal] = useState(null);

    const [apData, setApData] = useState([]); const [apCursor, setApCursor] = useState(null);
    const [apLoading, setApLoading] = useState(false); const [apTotal, setApTotal] = useState(null);

    const [rvData, setRvData] = useState([]); const [rvCursor, setRvCursor] = useState(null);
    const [rvLoading, setRvLoading] = useState(false); const [rvTotal, setRvTotal] = useState(null);

    // ===== Secciones plegables =====
    const [openTopCreators, setOpenTopCreators] = useState(true);
    const [openTopCat, setOpenTopCat] = useState(true);
    const [openMyPhotos, setOpenMyPhotos] = useState(true);
    const [openCommunity, setOpenCommunity] = useState(true);
    const [openReviews, setOpenReviews] = useState(true);

    // ===== Helpers =====
    const safeAppend = (prev, next) => {
      if (!Array.isArray(next) || !next.length) return prev;
      const map = new Map();
      [...prev, ...next].forEach((it, idx) => {
        // intentamos varias claves posibles
        const key =
          it.creatorId ||
          it.userId ||
          it.reviewId ||
          it.photoId ||
          it.url ||
          it?.user?._id ||
          `k-${idx}`;
        if (!map.has(key)) map.set(key, it);
      });
      return Array.from(map.values());
    };
    const pickTotal = (res, fallback) =>
      res?.meta?.total ?? res?.meta?.count ?? res?.total ?? res?.count ?? fallback;

    // ===== Fetchers =====
    const fetchTopCreators = useCallback(
      async (isRefresh = false) => {
        if (tcLoading) return;
        setTcLoading(true);
        try {
          const payload =
            tcCursor && !isRefresh
              ? { _id: placeId, cursorCount: tcCursor.cursorCount, cursorId: tcCursor.cursorId }
              : { _id: placeId };
          const res = await getTopCreator(payload, () => {});
          setTcData(prev => (isRefresh ? res.items : safeAppend(prev, res.items)));
          setTcCursor(res.nextCursor || null);
          setTcTotal(
            pickTotal(
              res,
              isRefresh ? (res.items?.length ?? 0) : tcData.length + (res.items?.length ?? 0)
            )
          );
        } finally {
          setTcLoading(false);
        }
      },
      [placeId, tcCursor, tcLoading, tcData.length]
    );

    // NUEVO: Top Creadores por Categoría
    const fetchTopCreatorsByCategory = useCallback(
      async (isRefresh = false) => {
        if (tccLoading) return;
        setTccLoading(true);
        try {
          const payload =
            tccCursor && !isRefresh
              ? { _id: placeId, cursorCount: tccCursor.cursorCount, cursorId: tccCursor.cursorId }
              : { _id: placeId };
              
          const res = await getTopCreatorByCategory(payload, () => {});

          setTccData(prev => (isRefresh ? res.items : safeAppend(prev, res.items)));
          setTccCursor(res.nextCursor || null);
          setTccTotal(
            pickTotal(
              res,
              isRefresh ? (res.items?.length ?? 0) : tccData.length + (res.items?.length ?? 0)
            )
          );
        } finally {
          setTccLoading(false);
        }
      },
      [placeId, tccCursor, tccLoading, tccData.length]
    );

    const fetchMyPhotos = useCallback(
      async (isRefresh = false) => {
        if (mpLoading) return;
        setMpLoading(true);
        try {
          const payload =
            mpCursor && !isRefresh
              ? { _id: placeId, cursorCount: mpCursor.cursorCount, cursorId: mpCursor.cursorId }
              : { _id: placeId };
          const res = await getMyPhotos(payload, () => {});
          setMpData(prev => (isRefresh ? res.items : safeAppend(prev, res.items)));
          setMpCursor(res.nextCursor || null);
          setMpTotal(
            pickTotal(
              res,
              isRefresh ? (res.items?.length ?? 0) : mpData.length + (res.items?.length ?? 0)
            )
          );
        } finally {
          setMpLoading(false);
        }
      },
      [placeId, mpCursor, mpLoading, mpData.length]
    );

    const fetchAllPhotos = useCallback(
      async (isRefresh = false) => {
        if (apLoading) return;
        setApLoading(true);
        try {
          const payload =
            apCursor && !isRefresh
              ? { _id: placeId, cursorCount: apCursor.cursorCount, cursorId: apCursor.cursorId }
              : { _id: placeId };
          const res = await getAllPhotos(payload, () => {});
          setApData(prev => (isRefresh ? res.items : safeAppend(prev, res.items)));
          setApCursor(res.nextCursor || null);
          setApTotal(
            pickTotal(
              res,
              isRefresh ? (res.items?.length ?? 0) : apData.length + (res.items?.length ?? 0)
            )
          );
        } finally {
          setApLoading(false);
        }
      },
      [placeId, apCursor, apLoading, apData.length]
    );

    const fetchReviews = useCallback(
      async (isRefresh = false) => {
        if (rvLoading) return;
        setRvLoading(true);
        try {
          const payload =
            rvCursor && !isRefresh
              ? { _id: placeId, cursorCount: rvCursor.cursorCount, cursorId: rvCursor.cursorId }
              : { _id: placeId };
          const res = await getReviews(payload, () => {});
          setRvData(prev => (isRefresh ? res.items : safeAppend(prev, res.items)));
          setRvCursor(res.nextCursor || null);
          setRvTotal(
            pickTotal(
              res,
              isRefresh ? (res.items?.length ?? 0) : rvData.length + (res.items?.length ?? 0)
            )
          );
        } finally {
          setRvLoading(false);
        }
      },
      [placeId, rvCursor, rvLoading, rvData.length]
    );

    // ===== Carga inicial =====
    useEffect(() => {
      fetchTopCreators(true);
      fetchTopCreatorsByCategory(true); // <— NUEVO
      fetchMyPhotos(true);
      fetchAllPhotos(true);
      fetchReviews(true);
    }, [placeId]);

    // ===== API al padre =====
    const refreshAll = useCallback(async () => {
      setTcData([]); setTcCursor(null); setTcTotal(null);
      setTccData([]); setTccCursor(null); setTccTotal(null);
      setMpData([]); setMpCursor(null); setMpTotal(null);
      setApData([]); setApCursor(null); setApTotal(null);
      setRvData([]); setRvCursor(null); setRvTotal(null);
      await Promise.all([
        fetchTopCreators(true),
        fetchTopCreatorsByCategory(true),
        fetchMyPhotos(true),
        fetchAllPhotos(true),
        fetchReviews(true),
      ]);
    }, [fetchTopCreators, fetchTopCreatorsByCategory, fetchMyPhotos, fetchAllPhotos, fetchReviews]);

    useImperativeHandle(ref, () => ({
      refresh: refreshAll,
      refreshSection: async (key) => {
        switch (key) {
          case 'top':
            setTcData([]); setTcCursor(null); setTcTotal(null); await fetchTopCreators(true);
            break;
          case 'topCategory':
            setTccData([]); setTccCursor(null); setTccTotal(null); await fetchTopCreatorsByCategory(true);
            break;
          case 'my':
            setMpData([]); setMpCursor(null); setMpTotal(null); await fetchMyPhotos(true);
            break;
          case 'community':
            setApData([]); setApCursor(null); setApTotal(null); await fetchAllPhotos(true);
            break;
          case 'reviews':
            setRvData([]); setRvCursor(null); setRvTotal(null); await fetchReviews(true);
            break;
          default: break;
        }
      }
    }), [refreshAll, fetchTopCreators, fetchTopCreatorsByCategory, fetchMyPhotos, fetchAllPhotos, fetchReviews]);

    useEffect(() => {
      if (refreshKey !== undefined) refreshAll();
    }, [refreshKey]);

    // ===== Renders =====
    const PhotoCard = ({ url }) => (
      <View style={styles.card}>
        <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />
      </View>
    );

    // Normalizado para ambos endpoints (top y top por categoría)
    const renderTopCreatorItem = ({ item }) => {
      const u = item.user || item; // en top por categoría viene { user: {...} }, en otros quizá plano
      const total = item.totalItems ?? item.totalPhotos ?? item.total ?? 0;
      return (
        <TouchableOpacity>
          <View style={styles.card}>
            <Image source={{ uri: u?.avatar?.url || u?.avatar }} style={styles.avatar} />
            <View style={styles.tcInfo}>
              <Text style={styles.titleMd}>{u?.name} {u?.surname}</Text>
              <Text style={styles.subtle}>@{u?.kylotId ?? "—"}</Text>
              <Text style={styles.count}>{formatString(screenTexts.AumontText, { variable1: total })}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    const renderMyPhotoItem = ({ item }) => (
      <TouchableOpacity onPress={() => onOpenPhoto?.(item)}>
        <PhotoCard url={item.url} />
      </TouchableOpacity>
    );

    const renderCommunityItem = ({ item }) => (
      <TouchableOpacity onPress={() => onOpenPhoto?.(item)}>
        <PhotoCard url={item.url} />
      </TouchableOpacity>
    );

    const renderReviewItem = ({ item }) => (
      <TouchableOpacity onPress={() => onOpenReview?.(item)}>
        <View style={styles.card2}>
          <View style={styles.rvHeader}>
            <Image source={{ uri: item?.avatar?.url || item?.avatar }} style={styles.avatarSm} />
            <Text style={styles.kylotId}>@{item.kylotId}</Text>
          </View>
          <View style={styles.rvScore}>
            <Text style={styles.scoreNumber}>{item.number}</Text>
            <Image source={fullStar} style={styles.scoreStar} resizeMode="contain" />
          </View>
        </View>
      </TouchableOpacity>
    );

    const ListFooter = ({ loading, hasMore }) => (
      <View style={styles.footerWrap}>
        {loading ? <ActivityIndicator /> : !hasMore ? <Text style={styles.footerDot}>•</Text> : null}
      </View>
    );

    const SectionHeader = ({ title, subtitle, open, onToggle }) => (
      <TouchableOpacity style={styles.minimalHeader} onPress={onToggle} activeOpacity={0.6}>
        <View style={styles.minimalContent}>
          <View style={styles.titleSection}>
            <Text style={styles.minimalTitle}>{title}</Text>
            {!!subtitle && <Text style={styles.minimalSubtitle}>{subtitle}</Text>}
          </View>
          <View style={styles.minimalChevron}>
            <Text style={styles.chevronMinimal}>{open ? "−" : "+"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );

    // Subtítulos dinámicos
    const sTopCreators = formatString(screenTexts.TitleTopCreators, { variable1: tcTotal ?? tcData.length });
    const sTopCat     = formatString(screenTexts.TitleCategory, { variable1: categoria?.category })
    const sMyPhotos   = formatString(screenTexts.TitleMyPhotos, { variable1: mpTotal ?? mpData.length })
    const sCommunity  = formatString(screenTexts.TitleCommunityPhotos, { variable1: apTotal ?? apData.length })
    const sReviews    = formatString(screenTexts.TitleReviews, { variable1: rvTotal ?? rvData.length })

    return (
      <View style={styles.container}>
        {/* Top Creadores */}
        <SectionHeader
          title={formatString(screenTexts.NameSectionTopCreators, { variable1: name })}
          subtitle={sTopCreators}
          open={openTopCreators}
          onToggle={() => setOpenTopCreators(v => !v)}
        />
        {openTopCreators && (
          <FlatList
            horizontal
            data={tcData}
            keyExtractor={(it, idx) =>
              String(it.creatorId || it.userId || it?.user?._id || idx)
            }
            renderItem={renderTopCreatorItem}
            onEndReached={() => tcCursor && fetchTopCreators(false)}
            onEndReachedThreshold={0.4}
            ListFooterComponent={<ListFooter loading={tcLoading} hasMore={!!tcCursor} />}
            showsHorizontalScrollIndicator={false}
          />
        )}

        {/* Top Creadores de categoría — usa el MISMO renderer */}
        <SectionHeader
          title={formatString(screenTexts.NameSectionCategory, { variable1: categoria?.category })}
          subtitle={sTopCat}
          open={openTopCat}
          onToggle={() => setOpenTopCat(v => !v)}
        />
        {openTopCat && (
          <FlatList
            horizontal
            data={tccData}
            keyExtractor={(it, idx) =>
              String(it.creatorId || it.userId || it?.user?._id || idx)
            }
            renderItem={renderTopCreatorItem}
            onEndReached={() => tccCursor && fetchTopCreatorsByCategory(false)}
            onEndReachedThreshold={0.4}
            ListFooterComponent={<ListFooter loading={tccLoading} hasMore={!!tccCursor} />}
            showsHorizontalScrollIndicator={false}
          />
        )}

        {/* Mis historias */}
        <SectionHeader
          title={screenTexts.NameSectionMyPhotos}
          subtitle={sMyPhotos}
          open={openMyPhotos}
          onToggle={() => setOpenMyPhotos(v => !v)}
        />
        {openMyPhotos && (
          <FlatList
            horizontal
            data={mpData}
            keyExtractor={(it, idx) => String(it.photoId ?? it.url ?? idx)}
            renderItem={renderMyPhotoItem}
            onEndReached={() => mpCursor && fetchMyPhotos(false)}
            onEndReachedThreshold={0.4}
            ListFooterComponent={<ListFooter loading={mpLoading} hasMore={!!mpCursor} />}
            showsHorizontalScrollIndicator={false}
          />
        )}

        {/* Hilo de Comunidad */}
        <SectionHeader
          title={screenTexts.NameSectionCommunityPhotos}
          subtitle={sCommunity}
          open={openCommunity}
          onToggle={() => setOpenCommunity(v => !v)}
        />
        {openCommunity && (
          <FlatList
            horizontal
            data={apData}
            keyExtractor={(it, idx) => String(it.photoId ?? it.url ?? idx)}
            renderItem={renderCommunityItem}
            onEndReached={() => apCursor && fetchAllPhotos(false)}
            onEndReachedThreshold={0.4}
            ListFooterComponent={<ListFooter loading={apLoading} hasMore={!!apCursor} />}
            showsHorizontalScrollIndicator={false}
          />
        )}

        {/* Sistema de Reviews */}
        <SectionHeader
          title={screenTexts.NameSectionReviews}
          subtitle={sReviews}
          open={openReviews}
          onToggle={() => setOpenReviews(v => !v)}
        />
        {openReviews && (
          <FlatList
            horizontal
            data={rvData}
            keyExtractor={(it, idx) => String(it.reviewId ?? idx)}
            renderItem={renderReviewItem}
            onEndReached={() => rvCursor && fetchReviews(false)}
            onEndReachedThreshold={0.4}
            ListFooterComponent={<ListFooter loading={rvLoading} hasMore={!!rvCursor} />}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: { 
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  
  // Diseño ultra minimalista y elegante
  minimalHeader: {
    marginHorizontal: 20,
    marginVertical: 12,
  },
  minimalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  titleSection: {
    flex: 1,
    flexDirection: 'column',
  },
  minimalTitle: {
    fontSize: 22,
    fontWeight: '300',
    color: '#000000',
    letterSpacing: -0.6,
    lineHeight: 26,
    marginBottom: 2,
  },
  minimalSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  minimalChevron: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  chevronMinimal: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '200',
    letterSpacing: 0,
    lineHeight: 16,
  },

  card: {
    width: CARD_W, height: CARD_H, borderRadius: 16, backgroundColor: "#fff",
    marginHorizontal: 8, marginVertical: 8, overflow: "hidden",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  card2: {
    width: CARD_W, height: 60, borderRadius: 16, backgroundColor: "#fff",
    marginHorizontal: 8, marginVertical: 8, overflow: "hidden",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10,
  },
  image: { width: "100%", height: "100%", borderRadius: 12 },
  avatar: { width: CARD_W, height: CARD_H, resizeMode: "cover" },
  tcInfo: {
    position: "absolute", left: 0, bottom: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.45)", padding: 10,
    alignItems: "center", justifyContent: "center",
  },
  titleMd: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#fff",
    textAlign: "center",
  },
  subtle: { 
    fontSize: 12, 
    color: "#fff",
    textAlign: "center",
  },
  count: { 
    fontSize: 13, 
    marginTop: 6, 
    fontWeight: "600", 
    color: "#fff",
    textAlign: "center",
  },
  avatarSm: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  rvHeader: { flexDirection: "row", alignItems: "center" },
  rvScore: { flexDirection: "row", alignItems: "center" },
  scoreNumber: { fontSize: 20, color: "#111" },
  scoreStar: { width: 20, height: 20, marginLeft: 4 },
  footerWrap: { width: 80, justifyContent: "center", alignItems: "center" },
  footerDot: { fontSize: 18, color: "#9ca3af" },

  placeholderWrap: { paddingHorizontal: 8 },
  placeholderCard: {
    width: CARD_W, height: 120, borderRadius: 16,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "#f3f4f6", marginHorizontal: 8, marginVertical: 8
  },
  placeholderText: { color: "#6b7280", fontWeight: "600" },
});

export default SocialInfo;
