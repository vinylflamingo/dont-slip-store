import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TWEEN from '@tweenjs/tween.js';

interface ThreeDModelProps {
    color?: string;
    touchable?: boolean;
}

const ThreeDModel = ({ color, touchable }: ThreeDModelProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | undefined>(undefined);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true
        });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;

        if (color === "white") {
            renderer.setClearColor(0xffffff, 1); // Set background color to white
        }
        const container = containerRef.current;

        // Initialize the camera here
        const camera = new THREE.PerspectiveCamera(
            window.innerWidth < 650 ? 9 : 7,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;
        cameraRef.current = camera; // Store the camera in a ref

        const updateCanvasSize = () => {
            const isMobile = window.innerWidth < 650;
            const width = isMobile ? window.innerWidth : window.innerWidth * 0.50;
            const height = isMobile ? window.innerWidth : window.innerHeight * 0.50;
            renderer.setSize(width, height);

            // Update the camera aspect ratio and projection matrix
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        updateCanvasSize();
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();

        const loader = new GLTFLoader();
        let model: THREE.Group | null = null;
        let originalQuaternion: THREE.Quaternion | null = null;

        loader.load('/3d/logo3d.glb', (gltf) => {
            model = gltf.scene;
            model.rotation.y = Math.PI / 2;
            originalQuaternion = model.quaternion.clone();
            scene.add(model);
        });

        // Add sun-like lighting with more contrast and directionality
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 4);
        sunLight.position.set(5, 8, 5);
        scene.add(sunLight);

        // Key light (bright, main illumination)
        const keyLight = new THREE.PointLight(0xffffff, 5);
        keyLight.position.set(10, 10, 10);
        scene.add(keyLight);

        // Fill light (softer, to reduce harsh shadows)
        const fillLight = new THREE.PointLight(0xb8d4ff, 2);
        fillLight.position.set(-10, 5, 5);
        scene.add(fillLight);

        // Rim light (for edge definition and contrast)
        const rimLight = new THREE.PointLight(0xffffff, 3);
        rimLight.position.set(0, 5, -10);
        scene.add(rimLight);

        function animate() {
            requestAnimationFrame(animate);
            TWEEN.update();
            if (model) {
                model.rotation.y += 0.01;
            }
            renderer.render(scene, camera);
        }
        animate();

        let isDragging = false;
        let previousMousePosition = {
            x: 0,
            y: 0,
        };

        const onMouseDown = (e: MouseEvent) => {
            isDragging = true;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (isDragging && model) {
                const deltaMove = {
                    x: e.clientX - previousMousePosition.x,
                    y: e.clientY - previousMousePosition.y,
                };
                const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
                    new THREE.Euler(
                        toRadians(deltaMove.y * 1),
                        toRadians(deltaMove.x * 1),
                        0,
                        'XYZ'
                    )
                );
                model.quaternion.multiplyQuaternions(deltaRotationQuaternion, model.quaternion);
            }
            previousMousePosition = {
                x: e.clientX,
                y: e.clientY,
            };
        };

        const onMouseUp = (e: MouseEvent) => {
            isDragging = false;
            if (model && originalQuaternion) {
                const currentQuaternion = model.quaternion.clone();
                const targetQuaternion = originalQuaternion;

                const tween = new TWEEN.Tween({ t: 0 })
                    .to({ t: 1 }, 3000)
                    .onUpdate(({ t }) => {
                        model!.quaternion.copy(currentQuaternion).slerp(targetQuaternion, t);
                    })
                    .start();
            }
        };

        const onTouchStart = (e: TouchEvent) => {
            e.preventDefault(); // Prevents scrolling while interacting with the model
            isDragging = true;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (isDragging && model) {
                const deltaMove = {
                    x: e.touches[0].clientX - previousMousePosition.x,
                    y: e.touches[0].clientY - previousMousePosition.y,
                };
                const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
                    new THREE.Euler(
                        toRadians(deltaMove.y * 1),
                        toRadians(deltaMove.x * 1),
                        0,
                        'XYZ'
                    )
                );
                model.quaternion.multiplyQuaternions(deltaRotationQuaternion, model.quaternion);
            }
            previousMousePosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
        };

        const onTouchEnd = (e: TouchEvent) => {
            isDragging = false;
            if (model && originalQuaternion) {
                const currentQuaternion = model.quaternion.clone();
                const targetQuaternion = originalQuaternion;

                const tween = new TWEEN.Tween({ t: 0 })
                    .to({ t: 1 }, 3000)
                    .onUpdate(({ t }) => {
                        model!.quaternion.copy(currentQuaternion).slerp(targetQuaternion, t);
                    })
                    .start();
            }
        };

        if (touchable === true) {
            container.addEventListener('mousedown', onMouseDown);
            container.addEventListener('mousemove', onMouseMove);
            container.addEventListener('mouseup', onMouseUp);

            container.addEventListener('touchstart', onTouchStart);
            container.addEventListener('touchmove', onTouchMove);
            container.addEventListener('touchend', onTouchEnd);
        }

        window.addEventListener('resize', updateCanvasSize);

        return () => {

            if (touchable === true) {
                container.removeEventListener('mousedown', onMouseDown);
                container.removeEventListener('mousemove', onMouseMove);
                container.removeEventListener('mouseup', onMouseUp);

                container.removeEventListener('touchstart', onTouchStart);
                container.removeEventListener('touchmove', onTouchMove);
                container.removeEventListener('touchend', onTouchEnd);
            }

            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [color, touchable]);

    function toRadians(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    return (
        <div ref={containerRef} className="lg:mt-[40px] bg-white">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ThreeDModel;
