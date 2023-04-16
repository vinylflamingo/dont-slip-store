import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import TWEEN from '@tweenjs/tween.js'

const ThreeModel = () => {
    const containerRef = useRef();
    const canvasRef = useRef();


    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        const container = containerRef.current;

        renderer.setSize(window.innerWidth * 0.50, window.innerHeight * 0.50);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            window.innerWidth < 650 ? 9 : 7,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const loader = new GLTFLoader();
        let model = null;
        let originalQuaternion = null;

        loader.load('/3d/logo3d.glb', (gltf) => {
            model = gltf.scene;
            model.rotation.y = Math.PI / 2;
            originalQuaternion = model.quaternion.clone();
            scene.add(model);
        });

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(0, 0, 10);
        scene.add(ambientLight);
        scene.add(pointLight);

        camera.position.z = 5;

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

        container.addEventListener('mousedown', onMouseDown);
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseup', onMouseUp);

        return () => {
            container.removeEventListener('mousedown', onMouseDown);
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    return (
        <div ref={containerRef} className="mt-10 lg:mt-[8%]">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ThreeModel;
