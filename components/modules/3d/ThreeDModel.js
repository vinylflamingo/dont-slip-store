import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TWEEN from '@tweenjs/tween.js';

const ThreeDModel = ({ color, touchable}) => {
    console.log("touchable: ", touchable)

    const containerRef = useRef();
    const canvasRef = useRef();
    const cameraRef = useRef();

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

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
        let model = null;
        let originalQuaternion = null;

        loader.load('/3d/logo3d.glb', (gltf) => {
            model = gltf.scene;
            model.rotation.y = Math.PI / 2;
            originalQuaternion = model.quaternion.clone();
            scene.add(model);
        });

        // Add multiple lights to ensure the model is well-lit from all angles
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0xffffff, 0.8);
        pointLight1.position.set(10, 10, 10);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.8);
        pointLight2.position.set(-10, -10, 10);
        scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0xffffff, 0.8);
        pointLight3.position.set(-10, 10, -10);
        scene.add(pointLight3);

        const pointLight4 = new THREE.PointLight(0xffffff, 0.8);
        pointLight4.position.set(10, -10, -10);
        scene.add(pointLight4);

        function animate() {
            requestAnimationFrame(animate);
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

        const onMouseDown = (e) => {
            isDragging = true;
        };

        const onMouseMove = (e) => {
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

        const onMouseUp = (e) => {
            isDragging = false;
            if (model) {
                const currentQuaternion = model.quaternion.clone();
                const targetQuaternion = originalQuaternion;

                const tween = new TWEEN.Tween({ t: 0 })
                    .to({ t: 1 }, 3000)
                    .onUpdate(({ t }) => {
                        model.quaternion.copy(currentQuaternion).slerp(targetQuaternion, t);
                    })
                    .start();
            }
        };

        const onTouchStart = (e) => {
            e.preventDefault(); // Prevents scrolling while interacting with the model
            isDragging = true;
        };

        const onTouchMove = (e) => {
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

        const onTouchEnd = (e) => {
            isDragging = false;
            if (model) {
                const currentQuaternion = model.quaternion.clone();
                const targetQuaternion = originalQuaternion;

                const tween = new TWEEN.Tween({ t: 0 })
                    .to({ t: 1 }, 3000)
                    .onUpdate(({ t }) => {
                        model.quaternion.copy(currentQuaternion).slerp(targetQuaternion, t);
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

    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    return (
        <div ref={containerRef} className="mt-10 lg:mt-[8%] bg-white">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ThreeDModel;
