import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import arrow_left from '../../assets/arrow_left.png';

const PoliticaPrivacidad = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={arrow_left} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidad</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#004999', '#1D7CE4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <Text style={styles.heroTitle}>Política de Privacidad</Text>
            <Text style={styles.heroSubtitle}>Última actualización: Octubre 2025</Text>
          </LinearGradient>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          
          {/* Section 1 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>01</Text>
            <Text style={styles.sectionTitle}>Información que Recopilamos</Text>
            <Text style={styles.sectionText}>
              Recopilamos información que usted nos proporciona directamente, como cuando crea una cuenta, 
              actualiza su perfil, participa en actividades o se comunica con nosotros.
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Información de perfil (nombre, email, teléfono)</Text>
              <Text style={styles.bulletItem}>• Contenido que publica (fotos, videos, comentarios)</Text>
              <Text style={styles.bulletItem}>• Ubicación cuando usa funciones basadas en geolocalización</Text>
              <Text style={styles.bulletItem}>• Información de pago para transacciones</Text>
              <Text style={styles.bulletItem}>• Comunicaciones que tiene con nosotros</Text>
            </View>
          </View>

          {/* Section 2 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>02</Text>
            <Text style={styles.sectionTitle}>Cómo Usamos su Información</Text>
            <Text style={styles.sectionText}>
              Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, 
              así como para desarrollar nuevos productos y servicios.
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Proporcionar y personalizar nuestros servicios</Text>
              <Text style={styles.bulletItem}>• Procesar transacciones y pagos</Text>
              <Text style={styles.bulletItem}>• Comunicarnos con usted sobre su cuenta</Text>
              <Text style={styles.bulletItem}>• Mejorar la seguridad y prevenir fraudes</Text>
              <Text style={styles.bulletItem}>• Cumplir con obligaciones legales</Text>
            </View>
          </View>

          {/* Section 3 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>03</Text>
            <Text style={styles.sectionTitle}>Compartir Información</Text>
            <Text style={styles.sectionText}>
              No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en 
              las circunstancias limitadas descritas en esta política.
            </Text>
            <Text style={styles.sectionText}>
              Podemos compartir su información con:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Proveedores de servicios que nos ayudan a operar</Text>
              <Text style={styles.bulletItem}>• Autoridades legales cuando sea requerido por ley</Text>
              <Text style={styles.bulletItem}>• Con su consentimiento explícito</Text>
              <Text style={styles.bulletItem}>• En caso de fusión, adquisición o venta de activos</Text>
            </View>
          </View>

          {/* Section 4 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>04</Text>
            <Text style={styles.sectionTitle}>Seguridad de Datos</Text>
            <Text style={styles.sectionText}>
              Implementamos medidas de seguridad técnicas, administrativas y físicas apropiadas para 
              proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </Text>
            <Text style={styles.sectionText}>
              Sin embargo, ningún método de transmisión por Internet o método de almacenamiento 
              electrónico es 100% seguro, por lo que no podemos garantizar la seguridad absoluta.
            </Text>
          </View>

          {/* Section 5 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>05</Text>
            <Text style={styles.sectionTitle}>Sus Derechos</Text>
            <Text style={styles.sectionText}>
              Usted tiene varios derechos respecto a su información personal, incluyendo:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Acceder a su información personal</Text>
              <Text style={styles.bulletItem}>• Corregir información inexacta</Text>
              <Text style={styles.bulletItem}>• Eliminar su información personal</Text>
              <Text style={styles.bulletItem}>• Restringir el procesamiento de su información</Text>
              <Text style={styles.bulletItem}>• Portabilidad de datos</Text>
              <Text style={styles.bulletItem}>• Oponerse al procesamiento</Text>
            </View>
          </View>

          {/* Section 6 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>06</Text>
            <Text style={styles.sectionTitle}>Cookies y Tecnologías Similares</Text>
            <Text style={styles.sectionText}>
              Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso 
              de nuestros servicios y personalizar el contenido.
            </Text>
            <Text style={styles.sectionText}>
              Puede controlar las cookies a través de la configuración de su navegador, pero tenga en 
              cuenta que deshabilitar las cookies puede afectar la funcionalidad de nuestros servicios.
            </Text>
          </View>

          {/* Section 7 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>07</Text>
            <Text style={styles.sectionTitle}>Retención de Datos</Text>
            <Text style={styles.sectionText}>
              Conservamos su información personal durante el tiempo necesario para cumplir con los 
              propósitos descritos en esta política, a menos que la ley requiera o permita un período más largo.
            </Text>
            <Text style={styles.sectionText}>
              Cuando ya no necesitemos su información personal, la eliminaremos de forma segura 
              o la anonimizaremos.
            </Text>
          </View>

          {/* Section 8 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>08</Text>
            <Text style={styles.sectionTitle}>Menores de Edad</Text>
            <Text style={styles.sectionText}>
              Nuestros servicios no están dirigidos a menores de 13 años. No recopilamos 
              intencionalmente información personal de menores de 13 años.
            </Text>
            <Text style={styles.sectionText}>
              Si descubrimos que hemos recopilado información personal de un menor de 13 años, 
              eliminaremos esa información inmediatamente.
            </Text>
          </View>

          {/* Section 9 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>09</Text>
            <Text style={styles.sectionTitle}>Transferencias Internacionales</Text>
            <Text style={styles.sectionText}>
              Su información puede ser transferida y procesada en países distintos al suyo. 
              Nos aseguramos de que dichas transferencias cumplan con las leyes aplicables de 
              protección de datos.
            </Text>
          </View>

          {/* Section 10 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>10</Text>
            <Text style={styles.sectionTitle}>Cambios en esta Política</Text>
            <Text style={styles.sectionText}>
              Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos 
              sobre cambios materiales por correo electrónico o a través de un aviso prominente 
              en nuestros servicios.
            </Text>
            <Text style={styles.sectionText}>
              Su uso continuado de nuestros servicios después de que se publiquen los cambios 
              constituirá su aceptación de dichos cambios.
            </Text>
          </View>

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>¿Preguntas sobre Privacidad?</Text>
            <Text style={styles.contactText}>
              Si tiene alguna pregunta sobre esta Política de Privacidad o sobre cómo manejamos 
              su información personal, contáctenos:
            </Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactItem}>📧 privacy@kylot.com</Text>
              <Text style={styles.contactItem}>📱 +34 900 123 456</Text>
              <Text style={styles.contactItem}>🏢 Kylot Technologies, Madrid, España</Text>
            </View>
          </View>

        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />

      </ScrollView>

      {/* Accept Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={() => navigation.goBack()}
        >
          <LinearGradient
            colors={['#004999', '#1D7CE4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.acceptButtonText}>Entendido</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    marginBottom: 24,
  },
  heroGradient: {
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#004999',
    marginBottom: 8,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  sectionText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletList: {
    marginTop: 8,
    marginLeft: 8,
  },
  bulletItem: {
    fontSize: 15,
    fontWeight: '400',
    color: '#4B5563',
    lineHeight: 28,
    marginBottom: 4,
  },
  contactSection: {
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#D1E3F8',
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004999',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  contactText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  contactInfo: {
    marginTop: 8,
  },
  contactItem: {
    fontSize: 15,
    fontWeight: '600',
    color: '#004999',
    marginBottom: 8,
  },
  bottomSpacing: {
    height: 40,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  acceptButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default PoliticaPrivacidad;
