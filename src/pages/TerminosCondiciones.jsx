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

const TerminosCondiciones = () => {
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
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
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
            <Text style={styles.heroTitle}>Términos y Condiciones de Uso</Text>
            <Text style={styles.heroSubtitle}>Última actualización: Octubre 2025</Text>
          </LinearGradient>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          
          {/* Section 1 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>01</Text>
            <Text style={styles.sectionTitle}>Aceptación de los Términos</Text>
            <Text style={styles.sectionText}>
              Al acceder y utilizar Kylot, usted acepta estar sujeto a estos Términos y Condiciones de Uso, 
              todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de 
              todas las leyes locales aplicables.
            </Text>
            <Text style={styles.sectionText}>
              Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio 
              y aplicación. Los materiales contenidos en este sitio web y aplicación están protegidos por las 
              leyes de derechos de autor y marcas comerciales aplicables.
            </Text>
          </View>

          {/* Section 2 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>02</Text>
            <Text style={styles.sectionTitle}>Licencia de Uso</Text>
            <Text style={styles.sectionText}>
              Se concede permiso para descargar temporalmente una copia de los materiales en Kylot para 
              visualización transitoria personal y no comercial únicamente. Esta es la concesión de una licencia, 
              no una transferencia de título, y bajo esta licencia usted no puede:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Modificar o copiar los materiales</Text>
              <Text style={styles.bulletItem}>• Usar los materiales para cualquier propósito comercial</Text>
              <Text style={styles.bulletItem}>• Intentar descompilar o realizar ingeniería inversa</Text>
              <Text style={styles.bulletItem}>• Eliminar cualquier derecho de autor u otras notaciones</Text>
              <Text style={styles.bulletItem}>• Transferir los materiales a otra persona</Text>
            </View>
          </View>

          {/* Section 3 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>03</Text>
            <Text style={styles.sectionTitle}>Cuenta de Usuario</Text>
            <Text style={styles.sectionText}>
              Para acceder a ciertas funciones de Kylot, es posible que deba crear una cuenta. Usted es 
              responsable de mantener la confidencialidad de su cuenta y contraseña, y acepta aceptar la 
              responsabilidad de todas las actividades que ocurran bajo su cuenta.
            </Text>
            <Text style={styles.sectionText}>
              Nos reservamos el derecho de suspender o cancelar su cuenta si se detecta cualquier actividad 
              fraudulenta, ilegal o que viole estos términos.
            </Text>
          </View>

          {/* Section 4 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>04</Text>
            <Text style={styles.sectionTitle}>Contenido del Usuario</Text>
            <Text style={styles.sectionText}>
              Los usuarios pueden publicar, cargar o enviar contenido a través de Kylot. Al hacerlo, usted 
              garantiza que tiene todos los derechos necesarios sobre dicho contenido y que no infringe los 
              derechos de terceros.
            </Text>
            <Text style={styles.sectionText}>
              Nos reservamos el derecho de eliminar cualquier contenido que consideremos inapropiado, ofensivo 
              o que viole estos términos, sin previo aviso.
            </Text>
          </View>

          {/* Section 5 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>05</Text>
            <Text style={styles.sectionTitle}>Privacidad y Protección de Datos</Text>
            <Text style={styles.sectionText}>
              Su privacidad es importante para nosotros. El uso de información personal se rige por nuestra 
              Política de Privacidad. Al utilizar Kylot, usted acepta la recopilación y el uso de información 
              de acuerdo con nuestra Política de Privacidad.
            </Text>
          </View>

          {/* Section 6 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>06</Text>
            <Text style={styles.sectionTitle}>Limitación de Responsabilidad</Text>
            <Text style={styles.sectionText}>
              En ningún caso Kylot o sus proveedores serán responsables de daños especiales, incidentales, 
              indirectos o consecuentes que resulten del uso o la imposibilidad de usar los materiales, 
              incluso si Kylot o un representante autorizado ha sido notificado de la posibilidad de tales daños.
            </Text>
          </View>

          {/* Section 7 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>07</Text>
            <Text style={styles.sectionTitle}>Modificaciones de los Términos</Text>
            <Text style={styles.sectionText}>
              Kylot puede revisar estos términos de servicio en cualquier momento sin previo aviso. Al usar 
              esta aplicación, usted acepta estar sujeto a la versión actual de estos Términos y Condiciones.
            </Text>
            <Text style={styles.sectionText}>
              Le recomendamos que revise periódicamente estos términos para estar informado de cualquier cambio.
            </Text>
          </View>

          {/* Section 8 */}
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>08</Text>
            <Text style={styles.sectionTitle}>Ley Aplicable</Text>
            <Text style={styles.sectionText}>
              Estos términos se rigen e interpretan de acuerdo con las leyes aplicables, y usted se somete 
              irrevocablemente a la jurisdicción exclusiva de los tribunales en esa jurisdicción.
            </Text>
          </View>

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>¿Necesitas ayuda?</Text>
            <Text style={styles.contactText}>
              Si tienes alguna pregunta sobre estos Términos y Condiciones, por favor contáctanos:
            </Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactItem}>📧 legal@kylot.com</Text>
              <Text style={styles.contactItem}>📱 +34 900 123 456</Text>
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

export default TerminosCondiciones;

