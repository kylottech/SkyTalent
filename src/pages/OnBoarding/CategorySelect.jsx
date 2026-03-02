import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useUser } from "../../context/useUser";
import { getTags } from '../../services/logServices';
import ProgressBar from './ProgressBar';
import Top from '../../components/Utils/Top';
import HorizontalSlider from '../../components/Utils/HorizontalSlider';
import Error from '../../components/Utils/Error';
import { LinearGradient } from 'expo-linear-gradient';
import Buscador from '../../components/Utils/Buscador';

const normalizeNoAccent = (s = '') =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const CategorySelect = ({ answers, onNext, onBack, progress }) => {
  const { texts, translateTag, logout } = useUser();
  const screenTexts = texts?.pages?.OnBoarding?.CategorySelect ?? {};

  const [selected, setSelected] = useState([]);       // [ids]
  const selectedRef = useRef([]);
  const [categories, setCategories] = useState([]);   // [{ _id, category, superCategory }]
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Error');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Agrupa por superCategory en secciones [{ superCategory, items: [...] }]
  const groupIntoSections = (list = []) => {
    const map = new Map();
    list.forEach(t => {
      const key = t.superCategory || '';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([superCategory, items]) => ({
        superCategory,
        items: items.sort((x, y) => x.category.localeCompare(y.category)),
      }));
  };

  const handleGetTags = async () => {
    try {
      const response = await getTags(logout); // backend -> array de tags completos
      const localized = Array.isArray(response) ? translateTag(response) : [];
      const compact = localized.map(t => ({
        _id: t._id,
        category: t.category ?? '',
        superCategory: t.superCategory ?? '',
      }));
      setCategories(compact);
    } catch (e) {
      setError(true);
      setErrorMessage(e?.message);
    }
  };

  useEffect(() => {
    handleGetTags();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleGetTags();
    setRefreshing(false);
  }, []);

  const toggleCategory = (id) => {
    const next = selected.includes(id)
      ? selected.filter(x => x !== id)
      : [...selected, id];
    setSelected(next);
    selectedRef.current = next;
  };

  const handleNext = () => {
    onNext(selectedRef.current); // 👉 enviamos SOLO ids
  };

  const handleSkip = () => onNext([]);

  // Filtrado + secciones
  const filteredSections = useMemo(() => {
    const q = normalizeNoAccent(search.trim());
    const base = !q
      ? categories
      : categories.filter(t => {
          const name = normalizeNoAccent(t.category || '');
          const sup = normalizeNoAccent(t.superCategory || '');
          return name.includes(q) || sup.includes(q);
        });
    return groupIntoSections(base);
  }, [search, categories]);

  const noResults = filteredSections.length === 0;

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />

      <View style={styles.header}>
        <Top
          left={true}
          leftType={'Back'}
          back={onBack}
          typeCenter={'Text'}
          textCenter={screenTexts.Top}
          right={false}
        />
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>{screenTexts.SkipTouchable}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <View style={styles.content}>
          <Text style={styles.heading}>{screenTexts.CategoryTitle}</Text>
          <Text style={styles.subheading}>{screenTexts.CategorySubTitle}</Text>
        </View>

        {/* Buscador */}
        <View style={styles.searchWrapper}>
          <Buscador
            placeholder={screenTexts.SearchPlaceholder}
            search={search}
            func={setSearch}
            returnKeyType="search"
            containerStyle={styles.searchInputFullWidth}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.sectionsContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyboardShouldPersistTaps="handled"
        >
          {noResults && (
            <Text style={styles.noResults}>
              {screenTexts.NoResults}
            </Text>
          )}

          {filteredSections.map(section => (
            <View key={`sec-${section.superCategory}`} style={styles.section}>
              {!!section.superCategory && (
                <Text style={styles.sectionTitle}>{section.superCategory}</Text>
              )}

              <View style={styles.grid}>
                {section.items.map(cat => {
                  const isSelected = selected.includes(cat._id);
                  return (
                    <TouchableOpacity
                      key={cat._id}
                      onPress={() => toggleCategory(cat._id)}
                      style={styles.categoryButton}
                      activeOpacity={0.8}
                    >
                      {isSelected && (
                        <LinearGradient
                          colors={['#004999', '#1D7CE4']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={StyleSheet.absoluteFill}
                        />
                      )}
                      <Text style={[styles.categoryText, isSelected && styles.selectedText]}>
                        {cat.category}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        {error && <Error message={errorMessage} func={setError} />}
      </View>

      <View style={styles.footer}>
        <HorizontalSlider
          color={'Blue'}
          text={screenTexts.HorizontalSlider}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', width: '100%', height: '98%' },
  header: { flexDirection: 'row', alignItems: 'center' },
  skipText: { position: 'absolute', top: 0, right: 20, fontSize: 14, color: 'gray' },
  info: { paddingHorizontal: 16, flexDirection: 'column', flex: 1, marginBottom: 60 },
  content: { marginTop: 20 },
  heading: { fontSize: 28, fontWeight: 'bold', textAlign: 'left', marginBottom: 10 },
  subheading: { fontSize: 12, color: '#9d9d9d', textAlign: 'left', maxWidth: 300 },
  searchWrapper: { marginTop: 16 },
  searchInputFullWidth: { width: '100%' },
  sectionsContent: { paddingBottom: 80 },
  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 16, fontWeight: '600', color: '#333',
    paddingHorizontal: 4, paddingBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingBottom: 6,
  },
  noResults: { fontSize: 14, color: '#666', paddingVertical: 10 },
  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    margin: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: { fontSize: 16, color: '#000' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
  footer: { paddingBottom: 0, position: 'absolute', bottom: 0, right: 16, left: 16 },
});

export default CategorySelect;
