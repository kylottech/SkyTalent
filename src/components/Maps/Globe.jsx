import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import * as THREE from 'three';
import pinPais from '../../../assets/Pin_Paises.png';
import pinNegro from '../../../assets/pinMapa.png';

const Globe = ({ locations = [], shouldReset = false }) => {
  const glRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const sphereRef = useRef(null);
  const spriteGroupRef = useRef(null);
  const animationRef = useRef(null);

  const paisTextureRef = useRef(null);
  const negroTextureRef = useRef(null);

  const initTextures = async () => {
    const loader = new TextureLoader();
    if (!paisTextureRef.current) paisTextureRef.current = await loader.loadAsync(pinPais);
    if (!negroTextureRef.current) negroTextureRef.current = await loader.loadAsync(pinNegro);
  };

  const cleanup = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
    if (sceneRef.current) {
      sceneRef.current.clear();
      sceneRef.current = null;
    }
    if (sphereRef.current) {
      sphereRef.current.geometry?.dispose();
      sphereRef.current.material?.dispose();
      sphereRef.current = null;
    }
    spriteGroupRef.current = null;
  };

  const addMarkers = () => {
    if (!sphereRef.current || !paisTextureRef.current || !negroTextureRef.current) return;

    const group = new THREE.Group();

    locations.forEach(location => {
      const { latitude: lat, longitude: lng } = location.location;
      const type = location.type;
      const radius = 1.01;

      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = radius * -(Math.sin(phi) * Math.cos(theta));
      const z = radius * (Math.sin(phi) * Math.sin(theta));
      const y = radius * Math.cos(phi);

      const texture = type === 'pais' ? paisTextureRef.current : negroTextureRef.current;
      const aspectRatio = texture.image.width / texture.image.height;

      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);

      // ✅ Ancla la imagen desde la base
      sprite.center.set(0.5, 0); 

      sprite.scale.set(0.2 * aspectRatio, 0.2, 1);
      sprite.position.set(x, y, z);

      group.add(sprite);
    });

    sphereRef.current.add(group);
    spriteGroupRef.current = group;
  };

  const onContextCreate = async (gl) => {
    glRef.current = gl;
    await initTextures();
    setupScene(gl);
  };

  const setupScene = (gl) => {
    cleanup();

    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 3;
    cameraRef.current = camera;

    const loader = new TextureLoader();
    loader.loadAsync('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg')
      .then(texture => {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        sphereRef.current = sphere;
        scene.add(sphere);

        addMarkers();

        const animate = () => {
          sphere.rotation.y += 0.003;
          renderer.render(scene, camera);
          animationRef.current = requestAnimationFrame(animate);
          gl.endFrameEXP();
        };

        animate();
      });
  };

  useEffect(() => {
    if (glRef.current && shouldReset) {
      setupScene(glRef.current);
    }
  }, [shouldReset]);

  useEffect(() => {
    if (spriteGroupRef.current && sphereRef.current) {
      sphereRef.current.remove(spriteGroupRef.current);
    }
    if (sphereRef.current) {
      addMarkers();
    }
  }, [locations]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const lastTouch = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        lastTouch.current = { x: gestureState.x0, y: gestureState.y0 };
      },
      onPanResponderMove: (evt, gestureState) => {
        if (sphereRef.current) {
          const deltaX = gestureState.moveX - lastTouch.current.x;
          const deltaY = gestureState.moveY - lastTouch.current.y;

          sphereRef.current.rotation.y += deltaX * 0.005;
          sphereRef.current.rotation.x += deltaY * 0.005;

          lastTouch.current = { x: gestureState.moveX, y: gestureState.moveY };
        }
      }
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <GLView
        style={styles.canvas}
        onContextCreate={onContextCreate}
        onError={(error) => {
          console.error('GLView error:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvas: { flex: 1 }
});

export default Globe;
