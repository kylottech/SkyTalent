import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Easing, Dimensions } from "react-native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import { kylets } from '../../services/roulleteService';
import { formatString } from '../../utils/formatString'
import Top from "../../components/Utils/Top";
import ruleta_1 from '../../../assets/ruleta_1.png';  
import logo from '../../../assets/logoKylot_blanco.png';  
import corona_boton from '../../../assets/corona_boton.png';  
import Svg, { G, Path, Defs, LinearGradient, Stop, Text as SvgText, RadialGradient, Circle  } from "react-native-svg";
import Regalo from "../../components/Utils/Regalo";
import HorizontalSlider from "../../components/Utils/HorizontalSlider";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/useUser";
import Error from '../../components/Utils/Error';

const { width } = Dimensions.get("window");
const WHEEL_SIZE = width * 0.8; 
const CENTER_CIRCLE_SIZE = 60; 

// Configuración de los segmentos

const SECTIONS = [
  { label: "0" },
  { label: "20" },
  { label: "0"},
  { label: "10"},
  { label: "10" },
  { label: "0"},
  { label: "10" },
  { label: "0" },
]; 


const Ruleta = () => {
  const spinAnimation = useRef(new Animated.Value(0)).current;
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const navigate=useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.Ruleta.Ruleta
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  const handleRoullete = async () => {
    try {
      kylets({kylets: Number(winner)}, logout)
        .then(() => {
          navigate.navigate("Home")
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
};



const startSpin = () => {
  if (isSpinning) return;

  setIsSpinning(true);

  const spins = Math.floor(Math.random() * 5) + 5;
  const randomSection = Math.floor(Math.random() * SECTIONS.length);
  const anglePerSection = 360 / SECTIONS.length;
  const offset = randomSection * anglePerSection + anglePerSection / 2;
  const spinValue = spins * 360 + offset;

  Animated.timing(spinAnimation, {
    toValue: spinValue,
    duration: 4000,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true,
  }).start(() => {
    const winningIndex = getWinningIndex(spinValue);
    const result = SECTIONS[winningIndex].label;
    setWinner(result);
    setIsSpinning(false);

    // ✅ Solo mostrar felicitación si el resultado NO es "0"
    if (result !== "0") {
      setShowCongratulations(true);
    }
    else{
      navigate.navigate("Home")
    }
  });
};

  
  

  // Calcula el índice ganador basándonos en la posición final de la ruleta
  const getWinningIndex = (spinValue) => {
    const angle = (spinValue % 360 + 360) % 360; // Normaliza el ángulo entre 0 y 360
    const anglePerSection = 360 / SECTIONS.length;
  
    // Calculamos el índice de la sección ganadora
    // Si la rueda gira en sentido horario, el índice debe comenzar desde 0 en la parte superior.
    // Este cálculo debería alinear las secciones visualmente
    let index = Math.floor((360 - angle) / anglePerSection);  // Invertir la dirección de la ruleta
  
    // Si está en el borde, aseguramos que no se pase al siguiente índice
    const edgeThreshold = anglePerSection * 0.1;
    if (angle % anglePerSection < edgeThreshold) {
      index = Math.max(index - 1, 0);  // Se ajusta al valor anterior
    }
  

  
    return index;
  };
  
  
  
  
  
  
  

  const spinInterpolate = spinAnimation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const renderWheelSections = () => {
    const anglePerSegment = 360 / SECTIONS.length;
  
    return SECTIONS.map((section, index) => {
      const startAngle = index * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;
  
      const startRadians = (startAngle * Math.PI) / 180;
      const endRadians = (endAngle * Math.PI) / 180;
  
      const x1 = WHEEL_SIZE / 2 + (WHEEL_SIZE / 2) * Math.sin(startRadians);
      const y1 = WHEEL_SIZE / 2 - (WHEEL_SIZE / 2) * Math.cos(startRadians);
      const x2 = WHEEL_SIZE / 2 + (WHEEL_SIZE / 2) * Math.sin(endRadians);
      const y2 = WHEEL_SIZE / 2 - (WHEEL_SIZE / 2) * Math.cos(endRadians);
  
      const largeArcFlag = anglePerSegment > 180 ? 1 : 0;
  
      return (
        <G key={index}>
          <Path
            d={`M${WHEEL_SIZE / 2},${WHEEL_SIZE / 2} L${x1},${y1} A${WHEEL_SIZE / 2},${WHEEL_SIZE / 2} 0 ${largeArcFlag},1 ${x2},${y2} Z`}
            stroke="#CBB992"  // Bordes dorados
            strokeWidth={4} 
            fill="transparent"
          />
        </G>
      );
    });
  };
  

  const renderLabels = () => {
    const anglePerSegment = 360 / SECTIONS.length;
  
    return SECTIONS.map((section, index) => {
      const angle = index * anglePerSegment + anglePerSegment / 2; // Centrado en cada sección
      const radius = WHEEL_SIZE / 2 - 40; // Ajuste para mejor posición de las etiquetas
      const x = WHEEL_SIZE / 2 + radius * Math.sin((angle * Math.PI) / 180);
      const y = WHEEL_SIZE / 2 - radius * Math.cos((angle * Math.PI) / 180);
  
      const rotation = angle + 0; // Ajustar la rotación según el ángulo
  
      return (
        <SvgText
          key={index}
          x={x}
          y={y}
          fill="white"
          fontSize="25"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(${rotation}, ${x}, ${y})`} // Rotación aplicada
        >
          {section.label}
        </SvgText>
      );
    });
  };
  

  if (showCongratulations) {
    // Pantalla de felicitación
    return (
      <View style={styles.container2}>
        <Top
        left={true}
        leftType={"Back"}
        typeCenter={"Text"}
        textCenter={screenTexts.Top}
        right={false}
        rightType={"Wallet"}
      />
        <View style={styles.congratulationsContainer}>
          <Regalo numero={winner} />
          <Text style={styles.congratulationsText}>{screenTexts.Title}</Text>
          <Text style={styles.congratulationsSubText}>
          {formatString(screenTexts.SubTitle, { variable1: winner })}
          </Text>
          <HorizontalSlider text={screenTexts.ClaimHorizontalSlider} size='Big' color='blue'  onPress={handleRoullete} />
        </View>

        {error &&
        
          <TouchableOpacity style={styles.error} onPress={()=> setError(false)}>
            <Text style={styles.errorTexto}>{errorMessage}</Text>
          </TouchableOpacity>

        }

      </View>
    );
  }

  return (
    <View style={styles.supercontainer}>
      <Top
        left={true}
        leftType={"Back"}
        typeCenter={"Text"}
        textCenter={screenTexts.Top}
        right={false}
        rightType={"Wallet"}
      />
      <ExpoLinearGradient colors={['#021b79', '#0575e6']} start={[0, 0]} end={[1, 1]} style={styles.gradientContainer}>
        <Text style={styles.title}>{screenTexts.Title2}</Text>
        <Text style={styles.text}>{screenTexts.SpinSubtitle}</Text>
        <Text style={styles.inviteCount}>1</Text>
      </ExpoLinearGradient>
      <View style={styles.container}>
        

        {/* Imagen de la flecha sobre la ruleta */}
          

        {/* Ruleta */}
        <View style={{alignItems: 'center', marginTop: -WHEEL_SIZE -10}}>
        <View style={styles.wheelContainer}>
          <Animated.View
            style={{
              transform: [{ rotate: spinInterpolate }],
            }}
          >
            <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
              <Defs>
                {/* Gradiente radial para la rueda */}
                <RadialGradient id="radialGrad" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#00BFFF" />
                  <Stop offset="100%" stopColor="#004999" />
                </RadialGradient>

                {/* Gradiente radial dorado para el borde */}
                <RadialGradient id="radialGrad2" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#E3D9C4" />
                  <Stop offset="50%" stopColor="#E3D9C4" /> 
                  <Stop offset="100%" stopColor="#CBB992" />
                </RadialGradient>
              </Defs>

              <G origin={`${WHEEL_SIZE / 2}, ${WHEEL_SIZE / 2}`}>
                {/* Círculo dorado de fondo (borde) */}
                <Circle
                  cx={WHEEL_SIZE / 2}
                  cy={WHEEL_SIZE / 2}
                  r={WHEEL_SIZE / 2} 
                  fill="url(#radialGrad2)"
                />

                {/* Círculo principal de la rueda */}
                <Circle
                  cx={WHEEL_SIZE / 2}
                  cy={WHEEL_SIZE / 2}
                  r={WHEEL_SIZE / 2 - 10} // Un poco más pequeño para el borde dorado
                  fill="url(#radialGrad)"
                />

                {/* Secciones y etiquetas de la rueda */}
                {renderWheelSections()}
                {renderLabels()}
              </G>
            </Svg>
          </Animated.View>

          

          {/* Círculo central */}
          <ExpoLinearGradient
              colors={[ '#1D7CE4' , '#004999' ]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.centerCircle}
          >
            <Image source={logo} style={styles.logo} />
          </ExpoLinearGradient>

          
        </View>
        
        <View style={styles.arrowContainer}>
            <Image source={ruleta_1} style={styles.arrowImage} />
        </View>

        </View>

        <View style={{marginTop: WHEEL_SIZE +10, alignItems: 'center'}}>
          <TouchableOpacity
          style={styles.spinButton}
          onPress={startSpin}
          disabled={isSpinning}
          >
            <Image source={corona_boton} style={styles.spinButtonImage} />

          </TouchableOpacity>

          <Text style={styles.spinText}>{screenTexts.SpinTouchable}</Text>
        </View>
        

      </View>
      {error &&

        <Error message={errorMessage} func={setError} />

      }
    </View>
  );
};

const styles = StyleSheet.create({
  supercontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: WHEEL_SIZE -70,
    justifyContent: 'center',
  },
  container2:{
    flex: 1,
    backgroundColor: 'white'
  },
  textContainer: {
    marginTop: -20,
    paddingHorizontal: 22,
    alignSelf: 'flex-start'
  },
  subText: {
    color: "gray",
    fontSize: 16,
    paddingTop:10,
    marginBottom:8,
    textAlign: "left",
  },
  
  subText2: {
    color: "gray",
    fontSize: 12,
    margintTop:4,
    marginBottom: 10,
    textAlign: "left",
  },
  gradientContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  text: {
    color: 'white',
    marginTop: 8,
    fontSize: 12
  },
  inviteCount: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10
  },
  remainingText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  remainingSubText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 5,
  },
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 20,
    borderRadius: WHEEL_SIZE / 2, // Para evitar que se corte
    overflow: "hidden",
    //marginBottom: -WHEEL_SIZE
  },
  centerImageContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -CENTER_CIRCLE_SIZE / 2 }, { translateY: -CENTER_CIRCLE_SIZE / 2 }],
    zIndex: 1,
  },
  centerImage: {
    width: CENTER_CIRCLE_SIZE,
    height: CENTER_CIRCLE_SIZE,
    borderRadius: CENTER_CIRCLE_SIZE / 2,
  },
  arrowContainer: {
    marginTop: -WHEEL_SIZE -10
  },
  arrowImage: {
    width: 40,  
    height: 40,
    resizeMode: "contain",
  },
  centerCircle: {
    position: "absolute",
    width: CENTER_CIRCLE_SIZE + 20, // Ligeramente más grande para superponerse sobre la imagen central
    height: CENTER_CIRCLE_SIZE + 20,
    borderRadius: (CENTER_CIRCLE_SIZE + 20) / 2,
    backgroundColor: "#004999",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 60, 
    height: 60,
    resizeMode: 'contain', 
  },
  spinButton: {
    backgroundColor: "#B5A363", 
    width: 70,  
    height: 70,  
    borderRadius: 50,  
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  spinButtonImage: {
    width: 48,  // Ajusta el tamaño de la imagen según tus necesidades
    height: 48,  // Mantén las proporciones de la imagen
    resizeMode: "contain",  // Asegura que la imagen no se deforme
  },
  winnerText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  congratulationsContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    //marginTop:'30%',
    justifyContent: 'center'
  },
  congratulationsText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#AE9358",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  congratulationsSubText: {
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
    marginBottom: 30,

  }, 
  error:{
    position: 'absolute',
    width:'98%',
    backgroundColor:'red',
    marginTop:40,
    height:40,
    borderRadius:10,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  errorTexto:{
    color:'white',
    alignSelf: 'center',
    fontWeight:'600',
  },
  spinText:{
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000'
  }
});

export default Ruleta;
