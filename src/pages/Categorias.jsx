import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/useUser';
import Top from '../components/Utils/Top';
import GradientButton from '../components/Utils/GradientButton';
import { getTags, addTags, getSelectedTags } from '../services/logServices';
import LoadingOverlay from '../components/Utils/LoadingOverlay';
import Error from '../components/Utils/Error';
import Confirmacion from '../components/Utils/Confirmacion';
import { LinearGradient } from 'expo-linear-gradient';
import Buscador from '../components/Utils/Buscador';

const normalizeNoAccent = (s = '') =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const Categorias = () => {
  const navigation = useNavigation();
  const { logout, texts, translateTag } = useUser();
  const screenTexts = texts.pages.Categorias;

  const [allCategories, setAllCategories] = useState([]); // [{ _id, category, superCategory }]
  const [userCategories, setUserCategories] = useState([]); // [id]
  const [selected, setSelected] = useState([]); // [id]
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  // agrupa por superCategory en secciones [{ superCategory, items: [...] }]
  const groupIntoSections = (list = []) => {
    const map = new Map();
    list.forEach((t) => {
      const key = t.superCategory || '';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });
    // orden opcional por superCategory alfabético
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([superCategory, items]) => ({
        superCategory,
        items: items.sort((x, y) => x.category.localeCompare(y.category)),
      }));
  };

  const handleGetTags = async () => {
    try {
      const response = await getTags(logout); // tags completos del backend
      const localized = Array.isArray(response) ? translateTag(response) : [];
      const compact = localized.map((t) => ({
        _id: t._id,
        category: t.category ?? '',
        superCategory: t.superCategory ?? '',
      }));
      setAllCategories(compact);
    } catch (e) {
      setError(true);
      setErrorMessage(e?.message);
    }
  };

  const handleGetSelectedTags = async () => {
    try {
      const response = await getSelectedTags(logout);
      const ids = Array.isArray(response)
      ? response.map((x) => (typeof x === 'string' ? x : x?._id)).filter(Boolean)
      : [];
      setUserCategories(ids);
      setSelected(ids);
    } catch (e) {
      setError(true);
      setErrorMessage(e?.message);
    }
  };

  const handlePostTags = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await addTags({ tags: selected }, logout); // enviamos solo ids
      setUserCategories(selected);
      setHasChanges(false);
      setConfirmacionMensaje(screenTexts.ConfirmationMensaje);
      setConfirmacion(true);
    } catch (e) {
      setError(true);
      setErrorMessage(e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true); // encendemos overlay
        await Promise.all([handleGetTags(), handleGetSelectedTags()]);
      } catch (e) {
        if (!cancelled) {
          setError(true);
          setErrorMessage(e?.message);
        }
      } finally {
        if (!cancelled) setLoading(false); // apagamos overlay al terminar
      }
    };

    fetchData();

    return () => {
      cancelled = true; // evita setState tras unmount
    };
  }, []);

  useEffect(() => {
    const sort = (arr) => [...arr].sort().join(',');
    setHasChanges(sort(selected) !== sort(userCategories));
  }, [selected, userCategories]);

  const toggleCategory = (categoryId) => {
    setSelected((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([handleGetTags(), handleGetSelectedTags()]);
    setRefreshing(false);
  }, []);

  // Filtrado y secciones: si search vacío, secciones de all; si no, secciones de los filtrados
  const filteredSections = useMemo(() => {
    const q = normalizeNoAccent(search.trim());
    const base = !q
      ? allCategories
      : (allCategories || []).filter((t) => {
          const name = normalizeNoAccent(t.category || '');
          const sup = normalizeNoAccent(t.superCategory || '');
          return name.includes(q) || sup.includes(q);
        });
    return groupIntoSections(base);
  }, [search, allCategories]);

  const noResults = filteredSections.length === 0;

  return (
    <View style={styles.container}>
      <Top
        left={true}
        leftType={'Back'}
        typeCenter={'Text'}
        textCenter={screenTexts.Top}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{screenTexts.Title}</Text>
          <Text style={styles.subtitle}>
            Selecciona las categorías que más te interesan para personalizar tu experiencia
          </Text>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Buscador
            placeholder={screenTexts.SearchPlaceholder}
            search={search}
            func={setSearch}
            returnKeyType="search"
            containerStyle={styles.searchInputFullWidth}
          />
        </View>

        {/* Selected Categories Counter */}
        {selected.length > 0 && (
          <View style={styles.counterSection}>
            <Text style={styles.counterText}>
              {selected.length} categoría{selected.length !== 1 ? 's' : ''} seleccionada{selected.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        {/* No Results State */}
        {noResults && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsTitle}>No se encontraron resultados</Text>
            <Text style={styles.noResultsText}>
              Intenta con otros términos de búsqueda
            </Text>
          </View>
        )}

        {/* Categories Sections */}
        {filteredSections.map((section, sectionIndex) => (
          <View key={`sec-${section.superCategory}`} style={styles.section}>
            {/* Section Header */}
            {!!section.superCategory && (
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLine} />
                <Text style={styles.sectionTitle}>{section.superCategory}</Text>
                <View style={styles.sectionHeaderLine} />
              </View>
            )}

            {/* Category Grid */}
            <View style={styles.grid}>
              {section.items.map((cat, index) => {
                const isSelected = selected.includes(cat._id);
                return (
                  <TouchableOpacity
                    key={cat._id}
                    onPress={() => toggleCategory(cat._id)}
                    style={[
                      styles.categoryButton,
                      isSelected && styles.categoryButtonSelected
                    ]}
                    activeOpacity={0.7}
                  >
                    {isSelected && (
                      <LinearGradient
                        colors={['#004999', '#1D7CE4']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <Text style={[
                      styles.categoryText, 
                      isSelected && styles.selectedText
                    ]}>
                      {cat.category}
                    </Text>
                    {isSelected && (
                      <View style={styles.selectedIndicator}>
                        <Text style={styles.selectedIndicatorText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {hasChanges && (
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <GradientButton
              text={screenTexts.GradientButton}
              color="Blue"
              onPress={handlePostTags}
            />
          </View>
        </View>
      )}

      {error && <Error message={errorMessage} func={setError} />}
      {confirmacion && (
        <Confirmacion
          message={confirmacionMensaje}
          func={setConfirmacion}
        />
      )}
      {loading && <LoadingOverlay />}
    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#fff', 
    flex: 1 
  },
  scrollContent: { 
    paddingBottom: 120,
    paddingTop: 8,
  },
  
  // Header Section
  headerSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    lineHeight: 24,
    fontWeight: '400',
  },
  
  // Search Section
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInputFullWidth: { 
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  
  // Counter Section
  counterSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  counterText: {
    fontSize: 14,
    color: '#004999',
    fontWeight: '600',
    backgroundColor: '#e6f2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  
  // No Results State
  noResultsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  
  // Sections
  section: { 
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    paddingHorizontal: 16,
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  // Category Buttons
  categoryButton: {
    width: (screenWidth - 72) / 2, // 24 padding * 2 + 24 gap = 72
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 56,
  },
  categoryButtonSelected: {
    borderColor: '#004999',
    shadowColor: '#004999',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  categoryText: { 
    fontSize: 15, 
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedText: { 
    color: '#fff', 
    fontWeight: '700',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorText: {
    color: '#004999',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Footer
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  footerContent: {
    paddingHorizontal: 24,
  },
});

export default Categorias;
