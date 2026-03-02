import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, Modal, Pressable, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { getTraking, getExtracts } from '../../services/bankServices';
import Top from '../../components/Utils/Top';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import BankExtract from '../../components/Blocks/BankExtract';
import Svg, { Rect, G, Text as SvgText, Line } from 'react-native-svg';

const CHART_HEIGHT = 180;
const BAR_WIDTH = 18;
const BAR_GAP = 8;
const PADDING_H = 32;

const BalanceBarChart = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  const values = React.useMemo(() => data.map(d => Number(d.balance) || 0), [data]);
  const maxAbs = React.useMemo(() => Math.max(1, ...values.map(v => Math.abs(v))), [values]);
  const heightFromVal = (v) => (Math.abs(v) / maxAbs) * CHART_HEIGHT;

  const contentWidth = React.useMemo(
    () => PADDING_H * 2 + data.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP,
    [data.length]
  );

  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(Math.round(Dimensions.get('window').width - 34));

  useEffect(() => {
    const canScroll = contentWidth > containerWidth;
    if (scrollRef.current && canScroll) {
      const x = contentWidth - containerWidth;
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ x, y: 0, animated: false });
      });
    }
  }, [contentWidth, containerWidth]);

  return (
    <View
      ref={containerRef}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width || containerWidth;
        setContainerWidth(w);
      }}
      style={{ marginTop: 8 }}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <Svg width={Math.max(containerWidth, contentWidth)} height={CHART_HEIGHT + 60}>
          {/* Enhanced grid background */}
          <Line x1={PADDING_H} x2={Math.max(containerWidth, contentWidth) - PADDING_H} y1={CHART_HEIGHT * 0.2} y2={CHART_HEIGHT * 0.2} stroke="#F3F4F6" strokeWidth="1" />
          <Line x1={PADDING_H} x2={Math.max(containerWidth, contentWidth) - PADDING_H} y1={CHART_HEIGHT * 0.4} y2={CHART_HEIGHT * 0.4} stroke="#F3F4F6" strokeWidth="1" />
          <Line x1={PADDING_H} x2={Math.max(containerWidth, contentWidth) - PADDING_H} y1={CHART_HEIGHT * 0.6} y2={CHART_HEIGHT * 0.6} stroke="#F3F4F6" strokeWidth="1" />
          <Line x1={PADDING_H} x2={Math.max(containerWidth, contentWidth) - PADDING_H} y1={CHART_HEIGHT * 0.8} y2={CHART_HEIGHT * 0.8} stroke="#F3F4F6" strokeWidth="1" />
          <Line x1={PADDING_H} x2={Math.max(containerWidth, contentWidth) - PADDING_H} y1={CHART_HEIGHT} y2={CHART_HEIGHT} stroke="#D1D5DB" strokeWidth="2" />

          {/* Y-axis labels */}
          <SvgText x={12} y={CHART_HEIGHT * 0.2 + 4} fontSize="11" fill="#6B7280" fontWeight="600">
            {Math.round(maxAbs * 0.8)}
          </SvgText>
          <SvgText x={12} y={CHART_HEIGHT * 0.4 + 4} fontSize="11" fill="#6B7280" fontWeight="600">
            {Math.round(maxAbs * 0.6)}
          </SvgText>
          <SvgText x={12} y={CHART_HEIGHT * 0.6 + 4} fontSize="11" fill="#6B7280" fontWeight="600">
            {Math.round(maxAbs * 0.4)}
          </SvgText>
          <SvgText x={12} y={CHART_HEIGHT * 0.8 + 4} fontSize="11" fill="#6B7280" fontWeight="600">
            {Math.round(maxAbs * 0.2)}
          </SvgText>
          <SvgText x={12} y={CHART_HEIGHT + 4} fontSize="11" fill="#6B7280" fontWeight="600">
            0
          </SvgText>

          <G x={PADDING_H} y={0}>
            {data.map((d, i) => {
              const val = Number(d.balance) || 0;
              const barH = heightFromVal(val);
              const x = i * (BAR_WIDTH + BAR_GAP);
              const y = CHART_HEIGHT - barH;
              
              // Enhanced banking colors with gradients
              const fill = val > 0 ? '#10B981' : (val < 0 ? '#EF4444' : '#6B7280');
              const stroke = val > 0 ? '#059669' : (val < 0 ? '#DC2626' : '#4B5563');

              return (
                <G key={`bar-${i}`}>
                  {/* Bar with gradient effect simulation */}
                  <Rect 
                    x={x} 
                    y={y} 
                    width={BAR_WIDTH} 
                    height={barH} 
                    rx={6} 
                    ry={6} 
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="1"
                  />
                  
                  {/* Value labels on bars */}
                  {Math.abs(val) > 0 && (
                    <SvgText
                      x={x + BAR_WIDTH / 2}
                      y={y - 8}
                      fontSize="11"
                      fill="#1F2937"
                      textAnchor="middle"
                      fontWeight="700"
                    >
                      {Math.abs(val)}
                    </SvgText>
                  )}
                  
                  {/* Date labels */}
                  {i % 7 === 0 && (
                    <SvgText
                      x={x + BAR_WIDTH / 2}
                      y={CHART_HEIGHT + 24}
                      fontSize="12"
                      fill="#6B7280"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {d.fecha?.slice(8)}
                    </SvgText>
                  )}
                  
                  {/* Month labels */}
                  {i % 30 === 0 && (
                    <SvgText
                      x={x + BAR_WIDTH / 2}
                      y={CHART_HEIGHT + 35}
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {d.fecha?.slice(5, 7)}
                    </SvgText>
                  )}
                </G>
              );
            })}
          </G>
        </Svg>
      </ScrollView>
    </View>
  );
};

const Transaction = () => {
  const navigate = useNavigation();
  const { texts, logout } = useUser();
  const screenTexts = texts.pages.BancoPages.Transaction;

  // Datos agrupados por fecha desde /bank/extracts
  const [data, setData] = useState([]);
  // Tracking para el gráfico
  const [traking, setTraking] = useState([]);
  // Pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  // Paginación
  const [cursor, setCursor] = useState(null);         // createAt del último item de la última página
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const loadingMoreRef = useRef(false); // para evitar dobles llamadas en onScroll

  // Modal
  const [modal, setModal] = useState({ visible: false, title: '', subtitle: '' });
  const openModal = ({title, subtitle}) => setModal({ visible: true, title, subtitle });
  const closeModal = () => setModal(m => ({ visible: false, title: '', subtitle: ''  }));

  // Utilidades
  const getNextCursor = (groups) => {
    if (!Array.isArray(groups) || groups.length === 0) return null;
    const lastGroup = groups[groups.length - 1];
    if (!lastGroup || !Array.isArray(lastGroup.datos) || lastGroup.datos.length === 0) return null;
    const lastItem = lastGroup.datos[lastGroup.datos.length - 1];
    return lastItem?.createAt || null;
  };

  const mergeGroups = (prevGroups, newGroups) => {
    if (!Array.isArray(prevGroups) || prevGroups.length === 0) return Array.isArray(newGroups) ? newGroups : [];
    if (!Array.isArray(newGroups) || newGroups.length === 0) return prevGroups;

    const map = new Map(prevGroups.map(g => [g.fecha, { ...g, datos: [...(g.datos || [])] }]));
    for (const g of newGroups) {
      const existing = map.get(g.fecha);
      if (!existing) {
        map.set(g.fecha, { fecha: g.fecha, datos: [...(g.datos || [])] });
      } else {
        // fusiona y ordena por createAt DESC evitando duplicados por _id+createAt
        const combined = [...existing.datos, ...(g.datos || [])];
        const seen = new Set();
        const unique = [];
        for (const item of combined) {
          const key = `${item?.createAt}-${item?.otherSide?._id ?? ''}-${item?.movimiento ?? ''}-${item?.actual ?? ''}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(item);
          }
        }
        unique.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
        map.set(g.fecha, { fecha: g.fecha, datos: unique });
      }
    }
    // devuelve ordenado por fecha DESC
    return Array.from(map.values()).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  };

  // Carga inicial
  useEffect(() => {
    (async () => {
      try {
        setLoadingInitial(true);
        // 1) tracking
        const t = await getTraking(logout);
        setTraking(Array.isArray(t) ? t : []);
        // 2) primera página de extracts
        const extracts = await getExtracts(logout);
        setData(Array.isArray(extracts) ? extracts : []);
        const next = getNextCursor(extracts);
        setCursor(next);
        setReachedEnd(!next || (Array.isArray(extracts) && extracts.length === 0));
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [logout]);

  // Pull-to-refresh = recargar todo desde cero
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setReachedEnd(false);
      setCursor(null);
      // tracking
      const t = await getTraking(logout);
      setTraking(Array.isArray(t) ? t : []);
      // extracts primera página
      const extracts = await getExtracts(logout);
      setData(Array.isArray(extracts) ? extracts : []);
      const next = getNextCursor(extracts);
      setCursor(next);
      setReachedEnd(!next || (Array.isArray(extracts) && extracts.length === 0));
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  }, [logout]);

  // Cargar más (scroll infinito)
  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || loadingMore || reachedEnd || !cursor) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const nextPage = await getExtracts(logout, cursor);
      if (!nextPage || nextPage.length === 0) {
        setReachedEnd(true);
        return;
      }
      setData(prev => mergeGroups(prev, nextPage));
      const next = getNextCursor(nextPage);
      if (next) {
        setCursor(next);
      } else {
        setReachedEnd(true);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [logout, cursor, loadingMore, reachedEnd]);

  // Detectar final del ScrollView
  const onScrollCheckEnd = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const distanceFromBottom = contentSize.height - (layoutMeasurement.height + contentOffset.y);
    if (distanceFromBottom < 250) {
      // cerca del final
      loadMore();
    }
  };

  const formatted = useMemo(() => {
    const clone = Array.isArray(data) ? [...data] : [];
    return clone.sort((a, b) => new Date(b?.fecha) - new Date(a?.fecha));
  }, [data]);

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);

    // Nombres de meses en español
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} de ${month} de ${year}`;
  }

  return (
    <View style={styles.container}>
      {/* Overlay de carga inicial delante de todo */}
      {loadingInitial && <LoadingOverlay />}

      <Top
        left
        leftType='Back'
        typeCenter='Text'
        textCenter={screenTexts.Top}
        right
        rightType='Wallet'
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        scrollEventThrottle={16}
        onScroll={onScrollCheckEnd}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>{screenTexts.Title}</Text>
          <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
        </View>

        {/* === Gráfico de barras (31 días) === */}
        {traking.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>{screenTexts.GraficName}</Text>
            <BalanceBarChart data={traking} />
            
            {/* Professional legend */}
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#059669' }]} />
                <Text style={styles.legendText}>Ingresos</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#dc2626' }]} />
                <Text style={styles.legendText}>Gastos</Text>
              </View>
            </View>
          </View>
        )}

        {/* === Listado por días === */}
        {formatted.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{screenTexts.EmptyExtracts}</Text>
          </View>
        ) : (
          <View style={styles.transactionsSection}>
            {formatted.map((bloque, idxFecha) => (
              <View key={`fecha-${idxFecha}`} style={styles.dateSection}>
                <View style={styles.dateHeader}>
                  <Text style={styles.sectionDate}>{formatDate(bloque?.fecha)}</Text>
                </View>

                <View style={styles.transactionsList}>
                  {(bloque?.datos || []).map((item, idx) => (
                    <BankExtract
                      key={`mov-${idx}-${item?.otherSide?._id ?? idx}`}
                      otherSide={item.otherSide}
                      actual={item.actual}
                      movimiento={item.movimiento}
                      info={item.info}
                      info2={item.info2}
                      onPress={openModal}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Indicador de carga al final para "cargar más" */}
        {loadingMore && (
          <ActivityIndicator size="small" color="#1D7CE4" style={{ marginVertical: 16 }} />
        )}
        {/* Si quieres indicar fin de lista:
        {reachedEnd && <Text style={{ textAlign:'center', color:'#9d9d9d', marginBottom:16 }}>No hay más</Text>} */}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modal.visible} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{modal.title}</Text>
            <Text style={styles.modalSubtitle}>{modal.subtitle}</Text>
            <Pressable style={styles.modalBtn} onPress={closeModal}>
              <Text style={styles.modalBtnText}>{screenTexts.CloseButton}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    width: '100%', 
    backgroundColor: 'white' 
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  title: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  subtitle: { 
    fontSize: 14, 
    color: '#6b7280', 
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: { 
    fontSize: 16, 
    color: '#9ca3af', 
    textAlign: 'center',
    lineHeight: 24,
  },

  chartCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chartTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#9e9e9e',
    marginBottom: 20,
    lineHeight: 28,
    letterSpacing: -0.025,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    letterSpacing: 0.025,
  },

  transactionsSection: {
    flex: 1,
  },
  dateSection: { 
    marginBottom: 24,
  },
  dateHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  sectionDate: {
    fontSize: 18, 
    fontWeight: '700', 
    color: '#9e9e9e',
    lineHeight: 24,
  },
  transactionsList: {
    paddingHorizontal: 4,
  },

  modalBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 24 
  },
  modalCard: { 
    width: '100%', 
    borderRadius: 20, 
    backgroundColor: '#fff', 
    paddingVertical: 24, 
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 12, 
    textAlign: 'center',
    color: '#1f2937',
    lineHeight: 32,
  },
  modalSubtitle: { 
    fontSize: 16, 
    color: '#6b7280', 
    marginBottom: 24, 
    textAlign: 'center',
    lineHeight: 24,
  },
  modalBtn: { 
    alignSelf: 'center', 
    paddingVertical: 14, 
    paddingHorizontal: 24, 
    borderRadius: 12, 
    backgroundColor: '#1D7CE4',
    minWidth: 120,
  },
  modalBtnText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  }
});

export default Transaction;
